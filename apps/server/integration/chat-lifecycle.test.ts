import { createChatDiscovery } from "@opencok/connection/chat-discovery";
import { createHandler } from "@opencok/api/handler";
import { SocketClient } from "./support/chat.ts";
import { user_mixed_info } from "@opencok/drizzle/schema/opencok_kingdom/user_mixed_info";
import { createServer, type AddressInfo } from "node:net";
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
import type { Config } from "../src/config.ts";
import { sfs, Type } from "@opencok/messages/sfs";
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

test("realm sessions, API discovery and chat sockets preserve authorized messages across restart", async () => {
  const pg = new DisposablePostgres();
  let api: ReturnType<typeof Bun.serve> | undefined;
  const sockets: SocketClient[] = [];
  const resources = await mkdtemp(join(tmpdir(), "opencok-server-test-"));
  const suffix = randomBytes(6).toString("hex");
  const redis = `opencok-server-redis-${suffix}`,
    zk = `opencok-server-zk-${suffix}`;
  const containers: string[] = [];
  const servers: Awaited<ReturnType<typeof startServer>>[] = [];
  const clients: Client[] = [];
  let chat: ReturnType<typeof createChatApp> | undefined;
  let chatRepository: ReturnType<typeof createChatRepository> | undefined;
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
        lang: "en",
        allianceId: "synthetic-alliance",
        appVersion: "12.06.0",
        deviceId: "synthetic-hardware",
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
    const startChat = async (port = 0) => {
      if (port === 0) {
        const probe = createServer();
        await new Promise<void>((resolve) => probe.listen(0, "127.0.0.1", resolve));
        port = (probe.address() as AddressInfo).port;
        await new Promise<void>((resolve) => probe.close(() => resolve()));
      }
      const app = createChatApp({
        repository: chatRepository!,
        signingSecret: "synthetic-chat-secret",
        websocketUrl: `ws://127.0.0.1:${port}/chat/ws`,
      });
      expect(await app.runMaintenance()).toBe(true);
      await new Promise<void>((resolve) => app.server.listen(port, "127.0.0.1", resolve));
      return app;
    };
    chat = await startChat();
    const chatPort = (chat.server.address() as AddressInfo).port;
    const chatOrigin = `http://127.0.0.1:${chatPort}`;
    const handler = createHandler(
      { getAll: async () => [], health: async () => {} },
      { read: async () => new Map() },
      { health: async () => {} },
      createChatDiscovery({ origin: chatOrigin, timeoutMs: 500 }),
    );
    api = Bun.serve({ hostname: "127.0.0.1", port: 0, fetch: handler.fetch });
    const publicOrigin = `http://127.0.0.1:${api.port}`;
    for (const path of ["/api/v1global_config", "/chat/server/links", "/chat/server/all"]) {
      const reply = await fetch(publicOrigin + path);
      expect(reply.status).toBe(200);
      expect(((await reply.json()) as { code: number }).code).toBe(1);
    }
    expect((await fetch(publicOrigin + "/external/session", { method: "POST" })).status).toBe(404);
    const base: Config = {
      chatSession: {
        url: `${chatOrigin}/external/session`,
        signingSecret: "synthetic-chat-secret",
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
    const sessions: string[] = [];
    for (const id of [1, 2]) {
      const settings = {
        ...base,
        kingdomId: id,
        kingdomDatabase: topology.kingdoms[id - 1]!.database,
        zkPath: `/opencok-experiment/CHAT${id}`,
      };
      const server = await startServer(settings, await loadRules(resources, id));
      servers.push(server);
      const client = new Client(server.port, id);
      clients.push(client);
      await client.handshake();
      expect((await client.login(base.loginSecret, String(1000 + id))).id?.type).toBe(Type.Int);
      await client.next();
      const ticket = await client.command("chat.session.create", { uid: sfs.string("forged") });
      expect(ticket.session?.type).toBe(Type.String);
      expect(Number(ticket.expire?.value)).toBeGreaterThan(Date.now() / 1000);
      sessions.push(String(ticket.session?.value));
    }
    const metadata = (await (await fetch(publicOrigin + "/api/v1global_config")).json()) as {
      data: { websocket: { urlArray: string[] } };
    };
    const websocketUrl = metadata.data.websocket.urlArray[0]!;
    expect(websocketUrl).toBe(`ws://127.0.0.1:${chatPort}/chat/ws`);
    const connectChat = async (uid: string, session: string) => {
      const socket = new SocketClient(websocketUrl, uid, session);
      sockets.push(socket);
      await socket.next("login.success");
      return socket;
    };
    const first = await connectChat("1001", sessions[0]!);
    const second = await connectChat("1002", sessions[1]!);
    expect((await first.command("user.init", {})).result.status).toBe("ok");
    expect((await first.command("room.getGlobalRoom", {})).result.id).toBe("global_public");
    expect((await first.command("room.getLocalRoom", { lang: "en" })).result.id).toBe("local_en");
    expect(
      (await first.command("room.joinMulti", { rooms: [{ group: "country", id: "country_2" }] }))
        .error.code,
    ).toBe("invalid_room");
    for (const [socket, id] of [
      [first, 1],
      [second, 2],
    ] as const)
      expect(
        (
          await socket.command("room.joinMulti", {
            rooms: [
              { group: "country", id: `country_${id}` },
              { group: "global", id: "global_public" },
              { group: "local", id: "local_en" },
            ],
          })
        ).result.status,
      ).toBe(true);
    expect(
      (await first.command("chat.room", { roomId: "country_1", msg: "kingdom" })).result.seqId,
    ).toBeGreaterThan(0);
    expect(
      (await first.command("history.roomsv2", { rooms: { country_1: 0 } })).result.rooms[0].msgs[0]
        .msg,
    ).toBe("kingdom");
    await first.command("chat.room", { roomId: "local_en", msg: "language" });
    expect((await second.next("push.chat.room")).data.msg).toBe("language");
    const sendTime = Date.now();
    const sent = await first.command(
      "chat.room",
      { roomId: "global_public", msg: "Olá 世界 🌍" },
      sendTime,
    );
    expect(sent.result.seqId).toBeGreaterThan(0);
    expect((await second.next("push.chat.room")).data.msg).toBe("Olá 世界 🌍");
    expect(
      (await first.command("chat.room", { roomId: "global_public", msg: "Olá 世界 🌍" }, sendTime))
        .result.seqId,
    ).toBe(sent.result.seqId);
    expect(
      (await first.command("chat.room", { roomId: "global_public", msg: "changed" }, sendTime))
        .error.code,
    ).toBe("invalid_message");
    expect(
      (await second.command("history.roomsv2", { rooms: { global_public: 0 } })).result.rooms[0]
        .msgs,
    ).toHaveLength(1);
    expect((await second.command("history.roomsv2", { rooms: { country_1: 0 } })).error.code).toBe(
      "invalid_room",
    );
    expect(
      (await second.command("history.roomsv2", { rooms: { country_2: 0 } })).result.rooms[0].msgs,
    ).toEqual([]);
    await databases
      .getKingdom(1)
      .pool.query('insert into opencok_kingdom.alliance_member (uid,"allianceId") values ($1,$2)', [
        "1001",
        "synthetic-alliance",
      ]);
    expect(
      (
        await first.command("room.joinMulti", {
          rooms: [{ group: "alliance", id: "alliance_1_synthetic-alliance" }],
        })
      ).result.status,
    ).toBe(true);
    expect(
      (
        await first.command("chat.room", {
          roomId: "alliance_1_synthetic-alliance",
          msg: "members only",
        })
      ).result.seqId,
    ).toBeGreaterThan(0);
    await databases
      .getKingdom(1)
      .pool.query("delete from opencok_kingdom.alliance_member where uid=$1", ["1001"]);
    expect(
      (await first.command("history.roomsv2", { rooms: { "alliance_1_synthetic-alliance": 0 } }))
        .error.code,
    ).toBe("invalid_room");
    await chat.close();
    chat = undefined;
    const outage = performance.now();
    expect((await clients[0]!.command("chat.session.create")).errorCode).toBeDefined();
    expect(performance.now() - outage).toBeLessThan(5000);
    expect((await fetch(publicOrigin + "/api/v1global_config")).status).toBe(503);
    expect((await fetch(publicOrigin + "/readyz")).status).toBe(200);
    expect((await clients[0]!.command("user.lv")).errorCode).toBeUndefined();
    chat = await startChat(chatPort);
    const resumed = await connectChat("1002", sessions[1]!);
    await resumed.command("room.joinMulti", { rooms: [{ group: "global", id: "global_public" }] });
    const history = await resumed.command("history.roomv2", {
      roomId: "global_public",
      start: 0,
      end: Date.now() + 1000,
    });
    expect(history.result.msg.map((message: { msg: string }) => message.msg)).toEqual([
      "Olá 世界 🌍",
    ]);
    await databases.global.pool.query(
      "update opencok_chat.chat_session set expires_at=$2 where uid=$1",
      ["1002", new Date(Date.now() - 1000).toISOString().slice(0, 23).replace("T", " ")],
    );
    expect(
      (await resumed.command("history.roomsv2", { rooms: { global_public: 0 } })).error.code,
    ).toBe("unauthorized");
  } finally {
    clients.forEach((client) => client.close());
    await Promise.allSettled(servers.map((server) => server.close()));
    sockets.forEach((socket) => socket.close());
    await chat?.close();
    await chatRepository?.close();
    await api?.stop(true);
    await databases?.close();
    for (const name of containers) await pg.docker(["rm", "--force", "--volumes", name]);
    await pg.stop();
    await rm(resources, { recursive: true, force: true });
  }
}, 180000);
