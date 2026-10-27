import { createAvatarTickets } from "@opencok/storage/avatar-tickets";
import { DisposableAvatarStorage } from "../../api/integration/support/minio.ts";
import { createHandler as createFiles } from "@opencok/api/files";
import { user_mixed_info } from "@opencok/drizzle/schema/opencok_kingdom/user_mixed_info";
import type { AddressInfo } from "node:net";
import { randomUUID } from "node:crypto";
import { createChatApp } from "../../chat/src/app.ts";
import { createChatRepository } from "@opencok/repositories/chat";
import { expect, test } from "bun:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomBytes } from "node:crypto";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createDatabases } from "@opencok/drizzle";
import { account_new } from "@opencok/drizzle/schema/opencok_global/account_new";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { queue } from "@opencok/drizzle/schema/opencok_kingdom/queue";
import { user_world } from "@opencok/drizzle/schema/opencok_kingdom/user_world";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { user_army } from "@opencok/drizzle/schema/opencok_kingdom/user_army";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { user_lord } from "@opencok/drizzle/schema/opencok_kingdom/user_lord";
import { DisposablePostgres } from "../../../packages/drizzle/tests/support/postgres.ts";
import { startServer } from "../src/server.ts";
import { Cache } from "@opencok/storage/session";
import { Coordination } from "@opencok/storage/coordination";
import { Database } from "@opencok/repositories/game";
import type { Config } from "../src/config.ts";
import { fields, sfs, Type } from "@opencok/messages/sfs";
import { FOREVER } from "@opencok/mappings/city";
import { Client } from "./client.ts";
import { dataConfigItems } from "../test/fixtures/data-config.ts";
import { loadRules } from "@opencok/resources/rules";

async function eventually(check: () => Promise<boolean>, timeout = 15000) {
  const end = Date.now() + timeout;
  while (Date.now() < end) {
    if (await check().catch(() => false)) return;
    await Bun.sleep(100);
  }
  throw new Error("Synthetic dependency readiness timed out");
}

test("avatar TCP lifecycle uploads through API and S3, survives restart, moderates and prevents restored receipt reuse", async () => {
  const pg = new DisposablePostgres();
  const media = new DisposableAvatarStorage();
  let mediaStore: Awaited<ReturnType<DisposableAvatarStorage["start"]>>;
  let filesServer: ReturnType<typeof Bun.serve> | undefined;
  const resources = await mkdtemp(join(tmpdir(), "opencok-server-test-"));
  const suffix = randomBytes(6).toString("hex");
  const redis = `opencok-server-redis-${suffix}`,
    zk = `opencok-server-zk-${suffix}`;
  const containers: string[] = [];
  const servers: Awaited<ReturnType<typeof startServer>>[] = [];
  const clients: Client[] = [];
  let chat: ReturnType<typeof createChatApp> | undefined;
  let chatRepository: ReturnType<typeof createChatRepository> | undefined;
  const adapters: Database[] = [];
  let databases: ReturnType<typeof createDatabases> | undefined;
  const topology = {
    globalDatabase: "synthetic_global",
    kingdoms: [
      { id: 1, database: "synthetic_kingdom_1" },
      { id: 2, database: "synthetic_kingdom_2" },
    ],
  };
  const endpoint = async (name: string, port: number) =>
    Number(
      Buffer.from(await pg.docker(["port", name, `${port}/tcp`]))
        .toString()
        .trim()
        .split(":")
        .at(-1),
    );
  try {
    const admin = await pg.start();
    try {
      for (const name of [topology.globalDatabase, ...topology.kingdoms.map((k) => k.database)])
        await admin.query(`CREATE DATABASE "${name}"`);
    } finally {
      await admin.end();
    }
    databases = createDatabases(pg.options, topology);
    await migrate(databases.global.db, {
      migrationsFolder: new URL("../../../packages/drizzle/migrations/global", import.meta.url)
        .pathname,
    });
    for (const kingdom of databases.kingdoms.values())
      await migrate(kingdom.db, {
        migrationsFolder: new URL("../../../packages/drizzle/migrations/kingdom", import.meta.url)
          .pathname,
      });
    for (const id of [1, 2]) {
      const db = databases.getKingdom(id).db;
      const uid = String(1000 + id);
      await databases.global.db.insert(account_new).values({
        gameUid: uid,
        server: String(id),
        uuid: "synthetic-device",
        gameUserLevel: 1,
        lastTime: 0n,
      });
      await db.insert(userprofile).values({
        uid,
        name: `Synthetic ${id}`,
        serverId: id,
        level: 1,
        exp: 0,
        country: "BR",
        deviceUuid: "synthetic-device",
        pf: "Google",
        picVer: id === 1 ? -1 : 2999999,
        gold: 9007199254740993n,
      });
      await db.insert(user_mixed_info).values({ uid, mdata: "{}" });
      await db.insert(user_resource).values({
        uid,
        wood: BigInt(10000 * id),
        stone: 0n,
        iron: 0n,
        food: 0n,
        silver: 0,
        chip: 0,
        diamond: 0,
        dragon_food: 0,
        dragon_gold: 0,
        lastUpdateTime: 0n,
      });
      await db
        .insert(user_building)
        .values({ uuid: "synthetic-building", uid, itemId: 400000, pos: 0, level: 1 });
      await db.insert(queue).values({
        uuid: "synthetic-queue",
        ownerId: uid,
        qid: 1,
        type: 0,
        startTime: FOREVER,
        endTime: FOREVER,
        updateTime: FOREVER,
      });
      await db.insert(user_world).values({ uid, pointId: 12011, worldId: 0, lastCityDefTime: 0n });
      await db.insert(worldpoint).values({
        id: 12011,
        worldId: 0,
        x: 10,
        y: 10,
        areaId: 0,
        gridType: 0,
        grid2Type: 0,
        pointType: 1,
        resLevel: 1,
        resInitValue: 0,
        ownerName: `Synthetic ${id}`,
      });
      await db.insert(user_army).values({ uid, armyId: "100001", level: 2, free: 17 });
      await db
        .insert(user_item)
        .values({ uuid: "synthetic-item", ownerId: uid, itemId: "200001", count: 7 });
      await db.insert(user_lord).values({ uid, medal: "synthetic-medal" });
    }
    const configRecords = [
      ...dataConfigItems({
        player_max: { k3: "30" },
        function_on6: { k12: "0" },
        resources_basics: { k7: "100", k8: "300" },
      }).values(),
    ]
      .map(
        (record) =>
          `<ItemSpec ${Object.entries(record)
            .map(([key, value]) => `${key}="${value}"`)
            .join(" ")}/>`,
      )
      .join("");
    const xml: Record<string, string> = {
      treasure: '<ItemSpec id="1" lv="1" exp="100" helper="1"/>',
      quest: "",
      building:
        '<ItemSpec id="400001" level="1" time="30"/><ItemSpec id="400002" level="2" time="40"/>',
      role: '<ItemSpec id="100101" player_exp="100000"/><ItemSpec id="100102" player_exp="200000"/>',
      position: '<ItemSpec id="9900" position="0"/><ItemSpec id="9906" position="6"/>',
      item: `<Group id="data_config">${configRecords}</Group>`,
      arms: '<ItemSpec id="100001" attack="12" attack_add="3" defence="10" defence_add="2" upkeep="24" power="0.5"/><ItemSpec id="100002"/>',
      goods:
        '<ItemSpec id="200001" para1="50"/><ItemSpec id="200002" para1="60"/><ItemSpec id="200021" type="17" price="100"/>',
    };
    for (const [name, records] of Object.entries(xml))
      await Bun.write(join(resources, `${name}.xml`), `<database>${records}</database>`);
    for (const [name, image, port] of [
      [redis, "redis:8.2.11-bookworm", 6379],
      [zk, "zookeeper:3.4.14", 2181],
    ] as const) {
      await pg.docker([
        "run",
        "--detach",
        "--rm",
        "--name",
        name,
        "--publish",
        `127.0.0.1::${port}`,
        image,
      ]);
      containers.push(name);
    }
    const url = new URL(`postgres://127.0.0.1:${pg.options.port}/postgres`);
    url.username = String(pg.options.user);
    url.password = String(pg.options.password);
    chatRepository = createChatRepository({ databaseUrl: url.toString(), topology });
    chat = createChatApp({
      repository: chatRepository,
      signingSecret: "synthetic-profile-secret",
      websocketUrl: "ws://127.0.0.1/chat/ws",
    });
    expect(await chat.runMaintenance()).toBe(true);
    await new Promise<void>((resolve) => chat!.server.listen(0, "127.0.0.1", resolve));
    const chatPort = (chat.server.address() as AddressInfo).port;
    mediaStore = await media.start();
    const ticketCache = new Cache({
      redisUrl: `redis://127.0.0.1:${await endpoint(redis, 6379)}/0`,
      timeoutMs: 5000,
      kingdomId: 1,
    });
    const tickets = createAvatarTickets((name, ...args) => ticketCache.command(name, ...args));
    filesServer = Bun.serve({
      hostname: "127.0.0.1",
      port: 0,
      fetch: (request) => createFiles(mediaStore, tickets)(request),
    });
    const base: Config = {
      avatarFiles: { origin: `http://127.0.0.1:${filesServer.port}` },
      avatarChat: {
        url: `http://127.0.0.1:${chatPort}/_internal/avatar-profile`,
        signingSecret: "synthetic-profile-secret",
      },
      nicknameChat: {
        url: `http://127.0.0.1:${chatPort}/_internal/nickname`,
        signingSecret: "synthetic-profile-secret",
      },
      host: "127.0.0.1",
      port: 0,
      healthPort: 0,
      kingdomId: 1,
      kingdomDatabase: topology.kingdoms[0]!.database,
      globalDatabase: topology.globalDatabase,
      databaseUrl: url.toString(),
      redisUrl: `redis://127.0.0.1:${await endpoint(redis, 6379)}/0`,
      zookeeper: `127.0.0.1:${await endpoint(zk, 2181)}`,
      zkPath: "/opencok-experiment/COK1",
      loginSecret: "synthetic-secret",
      mapSize: 1200,
      timeoutMs: 2000,
    };
    const cache = new Cache(base);
    await eventually(async () => (await cache.command("PING")) === "PONG");
    await cache.command("HSET", "opencok:kingdom:3:world-effects", "487", '{"value":"0.1"}');
    expect(await cache.worldEffects(3)).toEqual(new Map([["487", '{"value":"0.1"}']]));
    await eventually(async () => {
      const coordination = new Coordination({
        ...base,
        zkPath: `/opencok-experiment/probe_${suffix}`,
      });
      try {
        await coordination.start();
        return coordination.ready;
      } finally {
        coordination.close();
      }
    });
    for (const id of [1, 2]) {
      const uid = String(1000 + id);
      const settings = {
        ...base,
        kingdomId: id,
        kingdomDatabase: topology.kingdoms[id - 1]!.database,
        zkPath: `/opencok-experiment/AVATAR${id}`,
      };
      const review = async (decision: "approve" | "reject", expected: number, reviewId: string) => {
        const realmUrl = new URL(url);
        realmUrl.pathname = `/${settings.kingdomDatabase}`;
        const cli = Bun.spawn(
          [
            process.execPath,
            "--no-env-file",
            "scripts/moderate-avatar.ts",
            String(id),
            uid,
            String(expected),
            decision,
            reviewId,
          ],
          {
            cwd: new URL("../", import.meta.url).pathname,
            env: { ...process.env, DATABASE_ROLE: "kingdom", DATABASE_URL: realmUrl.toString() },
            stdout: "pipe",
            stderr: "pipe",
          },
        );
        const [, , exitCode] = await Promise.all([
          new Response(cli.stdout).text(),
          new Response(cli.stderr).text(),
          cli.exited,
        ]);
        expect(exitCode).toBe(0);
      };
      const rules = await loadRules(resources, id);
      rules.items.set("function_on5", { k2: "0" });
      rules.items.set("hero", { k9: "1", k7: "0", k8: "60" });
      let server = await startServer(settings, rules);
      servers.push(server);
      let client = new Client(server.port, id);
      clients.push(client);
      await client.handshake();
      expect((await client.login(base.loginSecret, uid)).id?.type).toBe(Type.Int);
      await client.next();
      expect(
        (await client.command("user.avatar.grant", { gameuid: sfs.string(String(1003 - id)) }))
          .errorCode,
      ).toBeDefined();
      if (id === 2) {
        expect((await client.command("user.avatar.grant")).errorCode).toBeDefined();
        expect((await client.command("user.update.picVer")).picVer).toEqual(sfs.int(3000000));
        continue;
      }
      const grant = await client.command("user.avatar.grant");
      expect(grant.sequence).toEqual(sfs.int(1));
      const body = new FormData();
      body.set(
        "data",
        JSON.stringify({
          data: [{ commandName: "user/UploadPhoto", params: [{ gameuid: uid, photo_seq: 1 }] }],
        }),
      );
      body.set(
        "file",
        new File([new Uint8Array(await media.image())], "synthetic.png", { type: "image/png" }),
      );
      const upload = await fetch(
        `http://127.0.0.1:${filesServer!.port}${grant.uploadPath?.value}`,
        { method: "POST", body },
      );
      expect(upload.status).toBe(200);
      const saved = (
        (await upload.json()) as { response: { data: { image_hash: string; path: string } }[] }
      ).response[0]!.data;
      const receipt = `1:${saved.image_hash}`;
      expect((await fetch(saved.path)).status).toBe(200);
      expect(
        (await fetch(`http://127.0.0.1:${filesServer!.port}/_internal/avatars/${uid}/1`)).status,
      ).toBe(401);
      const duplicate = await fetch(
        `http://127.0.0.1:${filesServer!.port}${grant.uploadPath?.value}`,
        { method: "POST", body },
      );
      expect(duplicate.status).toBe(200);
      mediaStore = await media.restart();
      await server.close();
      servers.splice(servers.indexOf(server), 1);
      server = await startServer(settings, rules);
      servers.push(server);
      client = new Client(server.port, id);
      clients.push(client);
      await client.handshake();
      await client.login(base.loginSecret, uid);
      await client.next();
      expect((await client.command("user.avatar.grant")).pendingHash?.value).toBe(saved.image_hash);
      const finish = await client.command("user.avatar.finish", { receipt: sfs.string(receipt) });
      expect(finish.picVer).toEqual(sfs.int(2000001));
      expect(
        (await client.command("user.avatar.finish", { receipt: sfs.string(receipt) })).picVer,
      ).toEqual(sfs.int(2000001));
      await eventually(
        async () =>
          (
            await databases!
              .getKingdom(id)
              .pool.query(
                'select "pendingEffects" from opencok_kingdom.avatar_completion where "ownerUid"=$1',
                [uid],
              )
          ).rows[0]?.pendingEffects === 0,
      );
      await client.command("report.picVer", { uid: sfs.string(uid) });
      const operationId = randomUUID().replaceAll("-", "");
      await review("reject", 2000001, operationId);
      await server.close();
      servers.splice(servers.indexOf(server), 1);
      server = await startServer(settings, rules);
      servers.push(server);
      client = new Client(server.port, id);
      clients.push(client);
      await client.handshake();
      await client.login(base.loginSecret, uid);
      const init = fields(fields((await client.next()).p).p);
      expect(fields(init.user).picVer).toEqual(sfs.int(3000001));
      await eventually(
        async () =>
          (
            await databases!
              .getKingdom(id)
              .pool.query(
                'select "pendingEffects" from opencok_kingdom.avatar_version_update where "operationId"=$1',
                [operationId],
              )
          ).rows[0]?.pendingEffects === 0,
      );
      expect(
        (
          await databases.global.pool.query(
            "select pic_ver from opencok_chat.chat_avatar_profile where owner_uid=$1",
            [uid],
          )
        ).rows[0].pic_ver,
      ).toBe(3000001);
      expect(
        (await client.command("user.avatar.finish", { receipt: sfs.string(receipt) })).picVer,
      ).toEqual(sfs.int(3000001));
      rules.items.set("function_on5", { k2: "1" });
      expect((await client.command("user.avatar.grant")).errorCode?.value).toBe("105770");
      await review("approve", 3000001, randomUUID().replaceAll("-", ""));
      expect((await client.command("user.avatar.grant")).sequence).toEqual(sfs.int(2));
      await databases
        .getKingdom(id)
        .pool.query('update opencok_kingdom.userprofile set "picVer"=-1 where uid=$1', [uid]);
      expect((await client.command("user.avatar.grant")).errorCode).toBeDefined();
      expect(
        (await client.command("user.avatar.finish", { receipt: sfs.string(receipt) })).errorCode,
      ).toBeDefined();
      expect((await mediaStore.find(uid, "1"))?.hash).toBe(saved.image_hash);
    }
  } finally {
    clients.forEach((client) => client.close());
    await Promise.allSettled(servers.map((server) => server.close()));
    await Promise.allSettled(adapters.map((adapter) => adapter.close()));
    if (chat) await new Promise<void>((resolve) => chat!.server.close(() => resolve()));
    await chatRepository?.close();
    await filesServer?.stop(true);
    await media.close();
    await databases?.close();
    for (const name of containers) await pg.docker(["rm", "--force", "--volumes", name]);
    await pg.stop();
    await rm(resources, { recursive: true, force: true });
  }
}, 180000);
