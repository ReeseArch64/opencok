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
import { Cache, Coordination } from "../src/infra.ts";
import { Database } from "../src/persistence.ts";
import type { Config } from "../src/config.ts";
import { fields, sfs, str, Type } from "../src/protocol/sfs.ts";
import { FOREVER } from "../src/game/dto.ts";
import { Client } from "./client.ts";

async function eventually(check: () => Promise<boolean>, timeout = 15000) {
  const end = Date.now() + timeout;
  while (Date.now() < end) {
    if (await check().catch(() => false)) return;
    await Bun.sleep(100);
  }
  throw new Error("Synthetic dependency readiness timed out");
}

test("PostgreSQL SFS login, city and map preserve state and isolate both realms", async () => {
  const pg = new DisposablePostgres();
  const resources = await mkdtemp(join(tmpdir(), "opencok-server-test-"));
  const suffix = randomBytes(6).toString("hex");
  const redis = `opencok-server-redis-${suffix}`,
    zk = `opencok-server-zk-${suffix}`;
  const containers: string[] = [];
  const servers: Awaited<ReturnType<typeof startServer>>[] = [];
  const clients: Client[] = [];
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
      const uid = `synthetic-player-${id}`;
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
        level: 1,
        exp: 0,
        country: "BR",
        deviceUuid: "synthetic-device",
        pf: "Google",
        gold: 9007199254740993n,
      });
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
    const xml: Record<string, string> = {
      building:
        '<ItemSpec id="400001" level="1" time="30"/><ItemSpec id="400002" level="2" time="40"/>',
      role: '<ItemSpec id="100101" player_exp="100000"/><ItemSpec id="100102" player_exp="200000"/>',
      position: '<ItemSpec id="9900" position="0"/><ItemSpec id="9906" position="6"/>',
      item: '<ItemSpec id="player_max" k3="30"/><ItemSpec id="resources_basics" k7="100" k8="300"/>',
      arms: '<ItemSpec id="100001" attack="12" attack_add="3" defence="10" defence_add="2" upkeep="24" power="0.5"/><ItemSpec id="100002"/>',
      goods: '<ItemSpec id="200001" para1="50"/><ItemSpec id="200002" para1="60"/>',
    };
    for (const [name, records] of Object.entries(xml))
      await Bun.write(join(resources, `${name}.xml`), `<database>${records}</database>`);
    for (const [name, image, port] of [
      [redis, "redis:6.2.24-bookworm", 6379],
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
    const base: Config = {
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
      resources,
      mapSize: 1200,
      timeoutMs: 2000,
    };
    const cache = new Cache(base);
    await eventually(async () => (await cache.command("PING")) === "PONG");
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
      const settings = {
        ...base,
        kingdomId: id,
        kingdomDatabase: topology.kingdoms[id - 1]!.database,
        zkPath: `/opencok-experiment/COK${id}`,
      };
      const server = await startServer(settings);
      servers.push(server);
      const adapter = new Database(settings);
      adapters.push(adapter);
      const before = await adapter.city(`synthetic-player-${id}`, Date.now());
      const client = new Client(server.port, id);
      clients.push(client);
      expect((await client.handshake()).tk?.type).toBe(Type.String);
      expect((await client.login("wrong", `synthetic-player-${id}`)).ec?.value).toBe(3);
      expect(
        (await client.login(base.loginSecret, `synthetic-player-${id}`, "wrong-device")).ec?.value,
      ).toBe(3);
      expect((await client.login(base.loginSecret, `synthetic-player-${3 - id}`)).ec?.value).toBe(
        3,
      );
      expect((await client.login(base.loginSecret, `synthetic-player-${id}`)).zn?.value).toBe(
        `COK${id}`,
      );
      const init = fields((await client.next()).p);
      expect(str(init, "c")).toBe("init");
      const data = fields(init.p);
      expect(fields(data.user).gold?.value).toBe(9007199254740993n);
      expect(fields(data.user).serverId?.value).toBe(id);
      expect(fields(data.resource).wood?.value).toBe(BigInt(10000 * id));
      expect(
        (await client.command("cmd.finishinit", { _cok_: sfs.string("synthetic-init") }))._cok_
          ?.value,
      ).toBe("synthetic-init");
      expect((await client.command("cmd.ping")).serverNowTime?.type).toBe(Type.Long);
      expect(
        fields(fields((await client.command("login.dataconfig")).dataConfig).player_max).k3?.value,
      ).toBe("30");
      const army = await client.command("login.other", { army: sfs.int(1) });
      expect(fields((army.army!.value as ReturnType<typeof sfs.object>[])[0]).free?.value).toBe(17);
      expect(fields((army.items!.value as ReturnType<typeof sfs.object>[])[0]).count?.value).toBe(
        7,
      );
      expect(fields((await client.command("login.other")).lord).medal?.value).toBe(
        "synthetic-medal",
      );
      expect((await client.command("build.info")).building?.type).toBe(Type.Array);
      for (const command of ["build.create", "build.upgrade", "queue.finish", "combat.attack"])
        expect((await client.command(command)).errorCode?.value).toBe("102192");
      const map = await client.command("world.get", {
        x: sfs.int(10),
        y: sfs.int(10),
        type: sfs.int(0),
        timeStamp: sfs.int(42),
      });
      expect(map.serverId?.value).toBe(id);
      expect(map.timeStamp?.value).toBe(42);
      const points = (map.points!.value as ReturnType<typeof sfs.string>[]).flatMap((part) =>
        JSON.parse(String(part.value)),
      );
      expect(points.map((p: string) => JSON.parse(p).o)).toContain(`Synthetic ${id}`);
      expect(await adapter.city(`synthetic-player-${id}`, Date.now())).toEqual(before);
      expect((await fetch(`http://127.0.0.1:${server.healthPort}/readyz`)).status).toBe(200);
      const replacement = new Client(server.port, id);
      clients.push(replacement);
      await replacement.handshake();
      expect((await replacement.login("wrong", `synthetic-player-${id}`)).ec?.value).toBe(3);
      expect((await client.command("cmd.ping")).serverNowTime?.type).toBe(Type.Long);
      expect((await replacement.login(base.loginSecret, `synthetic-player-${id}`)).id?.type).toBe(
        Type.Int,
      );
      await replacement.next();

      expect((await replacement.command("cmd.ping")).serverNowTime?.type).toBe(Type.Long);
    }
    const otherCache = new Cache({ ...base, kingdomId: 2 });
    expect(await cache.claim("synthetic-shared-uid", "synthetic-token-1")).toBe(true);
    expect(await otherCache.claim("synthetic-shared-uid", "synthetic-token-2")).toBe(true);
    await cache.release("synthetic-shared-uid", "synthetic-token-1");
    expect(await otherCache.refresh("synthetic-shared-uid", "synthetic-token-2")).toBe(true);
    await otherCache.release("synthetic-shared-uid", "synthetic-token-2");

    clients[0]!.close();
    await servers[0]!.close();
    servers.shift();
    const restarted = await startServer(base);
    servers.push(restarted);
    const reconnected = new Client(restarted.port);
    clients.push(reconnected);
    await reconnected.handshake();
    expect((await reconnected.login(base.loginSecret, "synthetic-player-1")).id?.type).toBe(
      Type.Int,
    );
    await reconnected.next();
    expect(fields((await reconnected.command("build.info")).resource).wood?.value).toBe(10000n);
    await pg.docker(["pause", redis]);
    await eventually(
      async () => (await fetch(`http://127.0.0.1:${restarted.healthPort}/readyz`)).status === 503,
    );
    await pg.docker(["unpause", redis]);
    await eventually(
      async () => (await fetch(`http://127.0.0.1:${restarted.healthPort}/readyz`)).status === 200,
    );
  } finally {
    clients.forEach((client) => client.close());
    await Promise.allSettled(servers.map((server) => server.close()));
    await Promise.allSettled(adapters.map((adapter) => adapter.close()));
    await databases?.close();
    for (const name of containers) await pg.docker(["rm", "--force", "--volumes", name]);
    await pg.stop();
    await rm(resources, { recursive: true, force: true });
  }
}, 180000);
