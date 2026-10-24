import { afterAll, beforeAll, expect, test } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { createDatabases } from "@opencok/drizzle";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { playerinfo } from "@opencok/drizzle/schema/opencok_kingdom/playerinfo";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { user_vip } from "@opencok/drizzle/schema/opencok_kingdom/user_vip";
import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import { alliance_member } from "@opencok/drizzle/schema/opencok_kingdom/alliance_member";
import { account_new } from "@opencok/drizzle/schema/opencok_global/account_new";
import { Cache } from "@opencok/storage/session";
import { createRealmNotifications } from "@opencok/connection/notifications";
import { decodeLegacyJsonObject } from "@opencok/messages/legacy-json";
import { sfs } from "@opencok/messages/sfs";
import type { SharedUserLayout, SharedUserUpdate } from "@opencok/contracts/shared-user";
import type { Rules } from "@opencok/rules/game";
import { createNicknameChangeRuntime } from "../src/nickname-change.ts";
import { migrateDatabase } from "../../../packages/drizzle/scripts/migrate.ts";
import { DisposablePostgres } from "../../../packages/drizzle/tests/support/postgres.ts";
import { DisposableRedis } from "./support/redis.ts";

const pg = new DisposablePostgres(),
  redis = new DisposableRedis();
const topology = {
  globalDatabase: "shared_global",
  kingdoms: [
    { id: 1, database: "shared_realm_1" },
    { id: 2, database: "shared_realm_2" },
  ],
};
const now = 1792756800123;
let databases: ReturnType<typeof createDatabases>,
  redisUrl = "",
  nextOwner = 2000;
const realm = (id = 1) => databases.getKingdom(id);
const cache = (id = 1) => new Cache({ redisUrl, timeoutMs: 500, kingdomId: id });
function runtime(
  id = 1,
  options: {
    cache?: Pick<Cache, "publishSharedUserInfo">;
    layout?: SharedUserLayout;
    timeoutMs?: number;
    rules?: Pick<Rules, "power">;
  } = {},
) {
  return createNicknameChangeRuntime({
    databases,
    kingdomId: id,
    rules: { goods: new Map([["200021", { type: "17", price: "100" }]]) },
    refundRatio: async () => {
      throw new Error("CN1 state unavailable");
    },
    notifications: createRealmNotifications(),
    timeoutMs: options.timeoutMs ?? 1000,
    report: () => {},
    sharedUser: {
      cache: options.cache ?? cache(id),
      layout: options.layout,
      rules: options.rules ?? {
        power: {
          vip: new Map([
            ["one", { id: "401", point: "0" }],
            ["two", { id: "406", point: "7" }],
          ]),
        },
      },
    },
  });
}
async function seed(id = 1, full = true) {
  const uid = String(++nextOwner);
  await realm(id)
    .db.insert(userprofile)
    .values({
      uid,
      name: `Before ${uid}`,
      country: "BR",
      level: 1,
      exp: 0,
      serverId: id,
      pf: "synthetic",
      gold: 300n,
      pic: full ? "g044" : null,
      picVer: 2000003,
      picfraId: 4,
      lang: full ? "pt" : null,
      allianceId: full ? `guild-${uid}` : null,
      gmFlag: full ? 1 : 0,
      crossFightSrcServerId: full ? 8 : -1,
      offLineTime: full ? 9007199254740994n : 0n,
    });
  await realm(id)
    .db.insert(user_item)
    .values({ uuid: `item-${uid}`, ownerId: uid, itemId: "200021", count: 3 });
  await databases.global.db.insert(account_new).values({
    gameUid: uid,
    server: String(id),
    uuid: "synthetic-device",
    gameUserName: `Before ${uid}`,
    gameUserLevel: 1,
    lastTime: 0n,
  });
  if (full) {
    await realm(id).db.insert(playerinfo).values({ uid, power: 9007199254740993n });
    await realm(id)
      .db.insert(user_building)
      .values({ uuid: `castle-${uid}`, uid, itemId: 400000, pos: 0, level: 16 });
    await realm(id)
      .db.insert(user_vip)
      .values({
        uid,
        score: 7,
        level: 99,
        loginDays: 0,
        lastLoginTime: 0n,
        vipEndTime: BigInt(now + 60000),
        sLevel: 3,
      });
    await realm(id)
      .db.insert(alliance)
      .values({
        uid: `guild-${uid}`,
        alliancename: `Guild ${uid}`,
        abbr: "ALL",
        createtime: 0n,
        bannerStyle: "synthetic",
      });
    await realm(id)
      .db.insert(alliance_member)
      .values({ uid, allianceId: `guild-${uid}`, rank: 5 });
  }
  return uid;
}
async function changed(uid: string, name: string, id = 1) {
  const instance = runtime(id),
    operationId = randomUUID();
  await instance.change(uid, operationId, name, now);
  return { instance, operationId };
}
async function fence(uid: string) {
  return BigInt(
    String(await cache().command("HGET", "opencok:shared-user:publication-version", uid)),
  );
}
function loseCommit(pool: ReturnType<typeof createDatabases>["global"]["pool"], statement: string) {
  const original = pool.connect,
    connect = pool.connect.bind(pool);
  let armed = true;
  Object.defineProperty(pool, "connect", {
    configurable: true,
    value: (...connectArgs: unknown[]) => {
      if (connectArgs.length) return Reflect.apply(original, pool, connectArgs);
      return connect().then((client) => {
        let touched = false;
        return {
          async query(...args: unknown[]) {
            const first = args[0],
              text =
                typeof first === "string"
                  ? first
                  : first && typeof first === "object" && "text" in first
                    ? first.text
                    : undefined;
            if (typeof text === "string" && text.startsWith("begin")) touched = false;
            if (typeof text === "string" && text.startsWith(statement)) touched = true;
            const result = await Reflect.apply(client.query, client, args);
            if (armed && touched && text === "commit") {
              armed = false;
              throw new Error("Synthetic lost commit reply");
            }
            return result;
          },
          release: (destroy?: boolean) => client.release(destroy),
        };
      });
    },
  });
  return {
    restore: () => Object.defineProperty(pool, "connect", { value: original }),
    fired: () => !armed,
  };
}

beforeAll(async () => {
  const admin = await pg.start();
  try {
    for (const name of [
      topology.globalDatabase,
      ...topology.kingdoms.map((entry) => entry.database),
    ])
      await admin.query(`CREATE DATABASE "${name}"`);
  } finally {
    await admin.end();
  }
  databases = createDatabases(pg.options, topology);
  await migrateDatabase(databases.global.pool, "global");
  for (const entry of topology.kingdoms) await migrateDatabase(realm(entry.id).pool, "kingdom");
  redisUrl = await redis.start();
}, 120_000);
afterAll(async () => {
  try {
    await databases?.close();
  } finally {
    try {
      await pg.stop();
    } finally {
      await redis.stop();
    }
  }
}, 30_000);

test("nickname shared-user delivery publishes all source profile fields and both marker contracts across kingdoms", async () => {
  for (const id of [1, 2]) {
    const uid = await seed(id),
      { instance, operationId } = await changed(uid, `Shared ${id}`, id);
    expect(await instance.deliverSharedUser(uid, operationId, now)).toBe(true);
    const raw = (await cache(id).sharedUserInfo(uid))!;
    expect(raw).toContain('"power":9007199254740993');
    expect(decodeLegacyJsonObject(raw)).toEqual({
      uid: sfs.string(uid),
      name: sfs.string(`Shared ${id}`),
      pic: sfs.string("g044"),
      picVer: sfs.int(2000003),
      picfraId: sfs.int(4),
      power: sfs.long(9007199254740993n),
      abbr: sfs.string("ALL"),
      lang: sfs.string("pt"),
      mainBuildingLevel: sfs.int(16),
      allianceId: sfs.string(`guild-${uid}`),
      gmFlag: sfs.int(1),
      crossFightSrcServerId: sfs.int(8),
      vipLevel: sfs.int(7),
      svipLevel: sfs.int(3),
      vipEndTime: sfs.long(BigInt(now + 60000)),
      offLineTime: sfs.long(9007199254740994n),
      rank: sfs.int(5),
    });
    expect(await cache(id).command("GET", `USER_LAST_UPDATE_TIME_${uid}`)).toBe(
      String(Math.floor(now / 1000)),
    );
    expect(await cache(id).playerUpdateTimes(id, [uid])).toEqual(
      new Map([[uid, String(Math.floor(now / 1000))]]),
    );
    expect(await instance.store.find(uid, operationId)).toMatchObject({ pendingEffects: 23 });
    const version = await fence(uid);
    expect(await instance.deliverSharedUser(uid, operationId, now + 1000)).toBe(false);
    expect(await fence(uid)).toBe(version);
    expect(
      (await realm(id).db.select().from(user_item).where(eq(user_item.ownerId, uid)))[0]!.count,
    ).toBe(2);
  }
});

test("alternate cache keys retain the source 30-day lifetime and sparse profiles create no missing managers", async () => {
  const uid = await seed(1, false),
    { operationId } = await changed(uid, "Sparse Shared");
  const instance = runtime(1, { layout: "keys", rules: { power: {} } });
  expect(await instance.deliverSharedUser(uid, operationId, now)).toBe(true);
  expect(await cache().sharedUserInfo(uid)).toBeNull();
  const body = JSON.parse((await cache().sharedUserInfo(uid, "keys"))!);
  expect(body).toEqual({
    uid,
    name: "Sparse Shared",
    picVer: 2000003,
    picfraId: 4,
    abbr: "",
    gmFlag: 0,
    crossFightSrcServerId: -1,
    vipLevel: 0,
    svipLevel: 0,
    rank: 0,
  });
  const ttl = Number(await cache().command("TTL", `USER_INFO_${uid}`));
  expect(ttl).toBeGreaterThan(2591990);
  expect(ttl).toBeLessThanOrEqual(2592000);
  expect(await realm().db.select().from(playerinfo).where(eq(playerinfo.uid, uid))).toEqual([]);
  expect(await realm().db.select().from(user_vip).where(eq(user_vip.uid, uid))).toEqual([]);
});

test("concurrent shared-user retries allocate and acknowledge one current publication", async () => {
  const uid = await seed(),
    { instance, operationId } = await changed(uid, "Concurrent Shared");
  const before = BigInt(
    (
      await databases.global.pool.query(
        "SELECT last_value::text AS value FROM opencok_global.shared_user_publication_seq",
      )
    ).rows[0].value,
  );
  const results = await Promise.all(
    Array.from({ length: 12 }, () => instance.deliverSharedUser(uid, operationId, now)),
  );
  expect(results.filter(Boolean)).toHaveLength(1);
  expect(await fence(uid)).toBe(before + 1n);
  expect(await instance.store.find(uid, operationId)).toMatchObject({ pendingEffects: 23 });
  expect(
    (await realm().db.select().from(user_item).where(eq(user_item.ownerId, uid)))[0]!.count,
  ).toBe(2);
});

test("shared-user authority rejects moved accounts, inconsistent names and ambiguous or unavailable profile inputs", async () => {
  const uid = await seed(),
    { instance, operationId } = await changed(uid, "Guarded Shared");
  await databases.global.db
    .update(account_new)
    .set({ server: "2" })
    .where(eq(account_new.gameUid, uid));
  await expect(instance.deliverSharedUser(uid, operationId, now)).rejects.toThrow();
  await databases.global.db
    .update(account_new)
    .set({ server: "1", gameUserName: "Other Name" })
    .where(eq(account_new.gameUid, uid));
  await expect(instance.deliverSharedUser(uid, operationId, now)).rejects.toThrow();
  await databases.global.db
    .update(account_new)
    .set({ gameUserName: "Guarded Shared" })
    .where(eq(account_new.gameUid, uid));
  await realm()
    .db.insert(user_building)
    .values({ uuid: `duplicate-${uid}`, uid, itemId: 400000, pos: 9, level: 30 });
  await expect(instance.deliverSharedUser(uid, operationId, now)).rejects.toThrow();
  await realm()
    .db.delete(user_building)
    .where(eq(user_building.uuid, `duplicate-${uid}`));
  await expect(
    runtime(1, { rules: { power: {} } }).deliverSharedUser(uid, operationId, now),
  ).rejects.toThrow();
  expect(await cache().sharedUserInfo(uid)).toBeNull();
  expect(await instance.store.find(uid, operationId)).toMatchObject({ pendingEffects: 31 });
  expect(await instance.deliverSharedUser(uid, operationId, now)).toBe(true);
});

test("Redis preflight failures do not overwrite profiles or clear durable work", async () => {
  const uid = await seed(),
    { instance, operationId } = await changed(uid, "Poison Guard");
  await cache().command("HSET", "cross_user_info_global", uid, '{"uid":"old"}');
  await cache().command("SET", `opencok:kingdom:1:player-update:${uid}`, "invalid-time");
  await expect(instance.deliverSharedUser(uid, operationId, now)).rejects.toThrow();
  expect(await cache().sharedUserInfo(uid)).toBe('{"uid":"old"}');
  expect(await instance.store.find(uid, operationId)).toMatchObject({ pendingEffects: 31 });
  await cache().command("DEL", `opencok:kingdom:1:player-update:${uid}`);
  await cache().command("SET", `USER_LAST_UPDATE_TIME_${uid}`, "invalid-legacy-time");
  expect(await instance.deliverSharedUser(uid, operationId, now)).toBe(true);
  expect(await cache().command("GET", `USER_LAST_UPDATE_TIME_${uid}`)).toBe(
    String(Math.floor(now / 1000)),
  );
  const version = await fence(uid),
    body = (await cache().sharedUserInfo(uid))!;
  const update: SharedUserUpdate = {
    owner: uid,
    kingdomId: 1,
    version,
    updatedAt: String(Math.floor(now / 1000)),
    body,
  };
  await cache().publishSharedUserInfo(update);
  await expect(
    cache().publishSharedUserInfo({ ...update, body: body.replace("Poison Guard", "Forged Name") }),
  ).rejects.toThrow();
  await expect(
    cache().publishSharedUserInfo({ ...update, version: version + 1n, body: '{"uid":"other"}' }),
  ).rejects.toThrow();
  expect(await cache().sharedUserInfo(uid)).toBe(body);
});

test("a timed-out Redis write cannot replace a newer publication even after clock rollback", async () => {
  const uid = await seed(),
    { operationId } = await changed(uid, "First Shared");
  const gate = Promise.withResolvers<void>();
  let delayed: Promise<void> | undefined,
    first = true;
  const captured: SharedUserUpdate[] = [];
  const delayedCache = {
    publishSharedUserInfo(update: SharedUserUpdate, layout?: SharedUserLayout) {
      captured.push(update);
      const wait = first;
      first = false;
      const task = (async () => {
        if (wait) await gate.promise;
        await cache().publishSharedUserInfo(update, layout);
      })();
      if (wait) delayed = task;
      return task;
    },
  };
  const slow = runtime(1, { cache: delayedCache, timeoutMs: 100 });
  await expect(slow.deliverSharedUser(uid, operationId, now + 10000)).rejects.toThrow();
  const newerId = randomUUID(),
    current = runtime();
  await current.change(uid, newerId, "Latest Shared", now);
  expect(await current.deliverSharedUser(uid, newerId, now - 10000)).toBe(true);
  const latestVersion = await fence(uid);
  expect(latestVersion).toBeGreaterThan(captured[0]!.version);
  gate.resolve();
  await Promise.allSettled([delayed]);
  expect(JSON.parse((await cache().sharedUserInfo(uid))!).name).toBe("Latest Shared");
  expect(await fence(uid)).toBe(latestVersion);
  expect(await cache().command("GET", `USER_LAST_UPDATE_TIME_${uid}`)).toBe(
    String(Math.floor((now - 10000) / 1000)),
  );
  expect(await current.deliverSharedUser(uid, operationId, now + 20000)).toBe(true);
  expect(JSON.parse((await cache().sharedUserInfo(uid))!).name).toBe("Latest Shared");
  expect(
    (await realm().db.select().from(userprofile).where(eq(userprofile.uid, uid)))[0],
  ).toMatchObject({ chNameCount: "2", name: "Latest Shared", gold: 300n });
  expect(
    (await realm().db.select().from(user_item).where(eq(user_item.ownerId, uid)))[0]!.count,
  ).toBe(1);
  const finalId = randomUUID();
  await current.change(uid, finalId, "Clock Lower", now);
  expect(await current.deliverSharedUser(uid, finalId, now - 10000)).toBe(true);
  expect(JSON.parse((await cache().sharedUserInfo(uid))!).name).toBe("Clock Lower");
  expect(await cache().command("GET", `USER_LAST_UPDATE_TIME_${uid}`)).toBe(
    String(Math.floor((now - 10000) / 1000)),
  );
  expect(await cache().playerUpdateTimes(1, [uid])).toEqual(
    new Map([[uid, String(Math.floor((now + 20000) / 1000))]]),
  );
});

test("global and realm commit reply loss recover shared-user acknowledgments without another payment", async () => {
  for (const scope of ["global", "realm"]) {
    const uid = await seed(),
      { instance, operationId } = await changed(uid, `Lost ${scope}`);
    const fault = loseCommit(
      scope === "global" ? databases.global.pool : realm().pool,
      scope === "global" ? "select nextval" : 'update "opencok_kingdom"."nickname_change"',
    );
    try {
      await expect(instance.deliverSharedUser(uid, operationId, now)).rejects.toThrow();
      expect(fault.fired()).toBe(true);
      expect(await instance.store.find(uid, operationId)).toMatchObject({
        pendingEffects: scope === "global" ? 31 : 23,
      });
      expect(JSON.parse((await cache().sharedUserInfo(uid))!).name).toBe(`Lost ${scope}`);
      expect(await instance.deliverSharedUser(uid, operationId, now)).toBe(scope === "global");
      expect(
        (await realm().db.select().from(userprofile).where(eq(userprofile.uid, uid)))[0]!
          .chNameCount,
      ).toBe("1");
      expect(
        (await realm().db.select().from(user_item).where(eq(user_item.ownerId, uid)))[0]!.count,
      ).toBe(2);
    } finally {
      fault.restore();
    }
  }
});

test("shared-user publication fences remain exact above Number precision and never cycle at signed exhaustion", async () => {
  const uid = await seed(),
    { instance, operationId } = await changed(uid, "Large Version");
  const before = (
    await databases.global.pool.query(
      "SELECT last_value::text AS value FROM opencok_global.shared_user_publication_seq",
    )
  ).rows[0].value;
  try {
    await databases.global.pool.query(
      "SELECT setval('opencok_global.shared_user_publication_seq',9007199254740992,true)",
    );
    expect(await instance.deliverSharedUser(uid, operationId, now)).toBe(true);
    expect(await fence(uid)).toBe(9007199254740993n);
    await expect(
      cache().publishSharedUserInfo({
        owner: uid,
        kingdomId: 1,
        version: 9007199254740992n,
        updatedAt: "1",
        body: `{"uid":"${uid}","name":"Older"}`,
      }),
    ).rejects.toThrow();
    expect(JSON.parse((await cache().sharedUserInfo(uid))!).name).toBe("Large Version");
    const other = await seed(),
      pending = await changed(other, "Exhaustion");
    await databases.global.pool.query(
      "SELECT setval('opencok_global.shared_user_publication_seq',9223372036854775807,true)",
    );
    await expect(
      pending.instance.deliverSharedUser(other, pending.operationId, now),
    ).rejects.toThrow();
    expect(await pending.instance.store.find(other, pending.operationId)).toMatchObject({
      pendingEffects: 31,
    });
    expect(await cache().sharedUserInfo(other)).toBeNull();
  } finally {
    await databases.global.pool.query(
      "SELECT setval('opencok_global.shared_user_publication_seq',$1::bigint,true)",
      [before],
    );
  }
});

test("PostgreSQL restart retains publication sequencing and pending acknowledgment recovery", async () => {
  const uid = await seed(),
    { instance, operationId } = await changed(uid, "Restart Shared");
  await realm().pool.query(
    "CREATE FUNCTION public.reject_shared_ack() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic acknowledgment failure'; END $$",
  );
  await realm().pool.query(
    'CREATE TRIGGER reject_shared_ack BEFORE UPDATE OF "pendingEffects" ON opencok_kingdom.nickname_change FOR EACH ROW EXECUTE FUNCTION public.reject_shared_ack()',
  );
  try {
    await expect(instance.deliverSharedUser(uid, operationId, now)).rejects.toThrow();
    expect(await instance.store.find(uid, operationId)).toMatchObject({ pendingEffects: 31 });
  } finally {
    await realm().pool.query("DROP TRIGGER reject_shared_ack ON opencok_kingdom.nickname_change");
  }
  const version = await fence(uid);
  await databases.close();
  await pg.restart();
  databases = createDatabases(pg.options, topology);
  const current = runtime();
  expect(await current.deliverSharedUser(uid, operationId, now + 10000)).toBe(true);
  expect(await fence(uid)).toBeGreaterThan(version);
  expect(await current.store.find(uid, operationId)).toMatchObject({ pendingEffects: 23 });
  expect(
    (await realm().db.select().from(userprofile).where(eq(userprofile.uid, uid)))[0],
  ).toMatchObject({ name: "Restart Shared", chNameCount: "1", gold: 300n });
}, 60_000);
