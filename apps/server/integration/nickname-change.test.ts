import { afterAll, beforeAll, expect, test } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { createDatabases } from "@opencok/drizzle";
import { nickname_change } from "@opencok/drizzle/schema/opencok_kingdom/nickname_change";
import { nickname_change_receipt } from "@opencok/drizzle/schema/opencok_global/nickname_change_receipt";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { account_new } from "@opencok/drizzle/schema/opencok_global/account_new";
import { usermapping } from "@opencok/drizzle/schema/opencok_global/usermapping";
import {
  createNicknameChangeStore,
  nicknameChangePayment,
} from "@opencok/repositories/nickname-change";
import type { NicknameChangeConfiguration } from "@opencok/contracts/nickname-change";
import { migrateDatabase } from "../../../packages/drizzle/scripts/migrate.ts";
import { DisposablePostgres } from "../../../packages/drizzle/tests/support/postgres.ts";

const pg = new DisposablePostgres();
const topology = {
  globalDatabase: "nickname_global",
  kingdoms: [
    { id: 1, database: "nickname_realm_1" },
    { id: 2, database: "nickname_realm_2" },
  ],
};
const now = 1792756800123;
let databases: ReturnType<typeof createDatabases>;
let nextOwner = 1000;
const configuration: NicknameChangeConfiguration = {
  itemType: () => "17",
  price: () => "100",
  refundRatio: async () => {
    throw new Error("CN1 session state unavailable");
  },
};
const store = (kingdomId = 1, config = configuration) =>
  createNicknameChangeStore(databases, kingdomId, config);
const realm = (id = 1) => databases.getKingdom(id);
const profile = async (uid: string, id = 1) =>
  (await realm(id).db.select().from(userprofile).where(eq(userprofile.uid, uid)))[0]!;
const item = async (uid: string, id = 1) =>
  (await realm(id).db.select().from(user_item).where(eq(user_item.ownerId, uid)))[0];
const receipt = async (operationId: string) =>
  (
    await databases.global.db
      .select()
      .from(nickname_change_receipt)
      .where(eq(nickname_change_receipt.operationId, operationId))
  )[0];

async function seed(
  options: {
    realm?: number;
    account?: boolean;
    items?: number;
    gold?: bigint;
    pf?: string;
  } = {},
) {
  const uid = String(++nextOwner),
    kingdomId = options.realm ?? 1;
  await realm(kingdomId)
    .db.insert(userprofile)
    .values({
      uid,
      name: `Before ${uid}`,
      country: "BR",
      level: 1,
      exp: 0,
      pf: options.pf ?? "synthetic",
      serverId: kingdomId,
      banTime: 0n,
      banFlag: 0,
      gold: options.gold ?? 200n,
      paidGold: 0n,
      paidSpecialGold: 0n,
      dmmGold: 30n,
      dmmPaidGold: 80n,
      dmmPaidSpecialGold: 40n,
    });
  if (options.items !== undefined)
    await realm(kingdomId)
      .db.insert(user_item)
      .values({
        uuid: `item-${uid}`,
        ownerId: uid,
        itemId: "200021",
        count: options.items,
        value: 17,
        vanishTime: 9007199254740993n,
      });
  if (options.account !== false) {
    await databases.global.db.insert(account_new).values({
      gameUid: uid,
      server: String(kingdomId),
      uuid: `device-${uid}`,
      gameUserName: `Before ${uid}`,
      gameUserLevel: 1,
      lastTime: 7n,
    });
    await databases.global.db.insert(usermapping).values([
      { gameUid: uid, mappingType: "name", mappingValue: `Before ${uid}` },
      { gameUid: uid, mappingType: "device", mappingValue: `device-${uid}`, lastTime: 9n },
    ]);
  }
  return uid;
}

function loseCommit(pool: ReturnType<typeof createDatabases>["global"]["pool"], statement: string) {
  const originalConnect = pool.connect;
  const connect = pool.connect.bind(pool);
  let armed = true;
  Object.defineProperty(pool, "connect", {
    configurable: true,
    value: (...connectArgs: unknown[]) => {
      if (connectArgs.length) return Reflect.apply(originalConnect, pool, connectArgs);
      return connect().then((client) => {
        let touched = false;
        return {
          async query(...args: unknown[]) {
            const first = args[0];
            const text =
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
              throw new Error("Synthetic lost commit response");
            }
            return result;
          },
          release: (destroy?: boolean) => client.release(destroy),
        };
      });
    },
  });
  return {
    restore: () => Object.defineProperty(pool, "connect", { value: originalConnect }),
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
  for (const pool of [databases.global.pool, realm().pool])
    await pool.query(
      "CREATE FUNCTION public.reject_nickname() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic write failure'; END $$",
    );
}, 120_000);

afterAll(async () => {
  try {
    await databases?.close();
  } finally {
    await pg.stop();
  }
}, 30_000);

test("owned item payment commits global identity, realm name, counter and owned world points once", async () => {
  const uid = await seed({ items: 2 });
  const outsider = await seed({ items: 4 });
  await realm()
    .db.insert(worldpoint)
    .values(
      [uid, uid, outsider].map((ownerId, index) => ({
        id: index + 1,
        x: index,
        y: 0,
        areaId: 1,
        gridType: 1,
        grid2Type: 0,
        pointType: 1,
        resLevel: 1,
        resInitValue: 1,
        ownerId,
        ownerName: `Before ${ownerId}`,
      })),
    );
  const operationId = randomUUID();
  const config = {
    ...configuration,
    price: () => {
      throw new Error("Item must precede price");
    },
  };
  const result = await store(1, config).change(uid, operationId, "Renamed Alpha", now);
  expect(result).toMatchObject({ state: "committed", responseGold: null, pendingEffects: 31 });
  expect(await store(1, config).change(uid, operationId, "Renamed Alpha", now + 1)).toEqual(result);
  expect(await store().recover(uid, operationId, now + 2)).toEqual(result);
  expect(await profile(uid)).toMatchObject({ name: "Renamed Alpha", chNameCount: "1", gold: 200n });
  expect(await item(uid)).toMatchObject({ count: 1, value: 17, vanishTime: 9007199254740993n });
  expect(await item(outsider)).toMatchObject({ count: 4 });
  expect(await receipt(operationId)).toMatchObject({
    ownerUid: uid,
    kingdomId: 1,
    newName: "Renamed Alpha",
  });
  const accounts = await databases.global.db
    .select()
    .from(account_new)
    .where(eq(account_new.gameUid, uid));
  expect(accounts[0]).toMatchObject({
    gameUserName: "Renamed Alpha",
    lastTime: 7n,
    uuid: `device-${uid}`,
  });
  const mappings = await databases.global.db
    .select()
    .from(usermapping)
    .where(eq(usermapping.gameUid, uid));
  expect(mappings.find((row) => row.mappingType === "name")?.mappingValue).toBe("Renamed Alpha");
  expect(mappings.find((row) => row.mappingType === "device")).toMatchObject({
    mappingValue: `device-${uid}`,
    lastTime: 9n,
  });
  const points = await realm().db.select().from(worldpoint);
  expect(points.filter((row) => row.ownerId === uid).map((row) => row.ownerName)).toEqual([
    "Renamed Alpha",
    "Renamed Alpha",
  ]);
  expect(points.find((row) => row.ownerId === outsider)?.ownerName).toBe(`Before ${outsider}`);
  await expect(store().change(uid, operationId, "Different Name", now)).rejects.toThrow();
  await expect(store().find(outsider, operationId)).rejects.toThrow();
  await store().change(uid, randomUUID(), "Renamed Beta", now + 3);
  expect(await item(uid)).toMatchObject({ count: 0 });
  expect(await profile(uid)).toMatchObject({ name: "Renamed Beta", chNameCount: "2" });
});

test("fallback preserves ordinary and exact DMM buckets and debit reply totals", async () => {
  const uid = await seed({ items: 0, gold: 20n });
  await realm()
    .db.update(userprofile)
    .set({ paidGold: 80n, paidSpecialGold: 40n })
    .where(eq(userprofile.uid, uid));
  const result = await store().change(uid, randomUUID(), "Mobile Name", now);
  expect(result.responseGold).toBe(40n);
  expect(await profile(uid)).toMatchObject({
    gold: 0n,
    paidSpecialGold: 0n,
    paidGold: 40n,
    dmmGold: 30n,
    dmmPaidGold: 80n,
    dmmPaidSpecialGold: 40n,
  });
  const dmm = await seed({ pf: "dmm" });
  const debit = await store().change(dmm, randomUUID(), "DMM Name", now);
  expect(debit.responseGold).toBe(150n);
  expect(await profile(dmm)).toMatchObject({
    gold: 200n,
    dmmGold: 0n,
    dmmPaidSpecialGold: 0n,
    dmmPaidGold: 50n,
  });
  expect(nicknameChangePayment(debit).kind).toBe("gold");
});

test("invalid inventory configuration and insufficient gold never create charges or operations", async () => {
  const uid = await seed({ gold: 99n });
  const operationId = randomUUID();
  await expect(store().change(uid, operationId, "Too Expensive", now)).rejects.toMatchObject({
    code: "E100001",
  });
  expect(await store().find(uid, operationId)).toBeUndefined();
  const invalidConfig = { ...configuration, itemType: () => "not-an-int" };
  await expect(
    store(1, invalidConfig).change(uid, randomUUID(), "Invalid Type", now),
  ).rejects.toThrow();
  expect(await profile(uid)).toMatchObject({ gold: 99n, chNameCount: "0", name: `Before ${uid}` });
});

test("UCA-equivalent names serialize globally across two realm databases", async () => {
  const first = await seed({ items: 1 }),
    second = await seed({ items: 1, realm: 2 });
  const ids = [randomUUID(), randomUUID()];
  const outcomes = await Promise.allSettled([
    store(1).change(first, ids[0]!, "Café Hero", now),
    store(2).change(second, ids[1]!, "Cafe Hero", now),
  ]);
  expect(outcomes.filter((outcome) => outcome.status === "fulfilled")).toHaveLength(1);
  expect(outcomes.filter((outcome) => outcome.status === "rejected")).toHaveLength(1);
  const winner = outcomes[0]!.status === "fulfilled" ? 0 : 1;
  const loserUid = winner === 0 ? second : first,
    loserRealm = winner === 0 ? 2 : 1;
  expect(await item(loserUid, loserRealm)).toMatchObject({ count: 1 });
  expect(await profile(loserUid, loserRealm)).toMatchObject({
    chNameCount: "0",
    name: `Before ${loserUid}`,
  });
  expect(await store(loserRealm).find(loserUid, ids[winner === 0 ? 1 : 0]!)).toBeUndefined();
});

test("concurrent retries of one operation charge one item and increment the signed counter once", async () => {
  const uid = await seed({ items: 3 }),
    operationId = randomUUID();
  await realm()
    .db.update(userprofile)
    .set({ chNameCount: "2147483647" })
    .where(eq(userprofile.uid, uid));
  const outcomes = await Promise.allSettled(
    Array.from({ length: 16 }, () => store().change(uid, operationId, "Concurrent Name", now)),
  );
  expect(outcomes.some((outcome) => outcome.status === "fulfilled")).toBe(true);
  expect(await store().recover(uid, operationId, now + 1)).toMatchObject({ state: "committed" });
  expect(await profile(uid)).toMatchObject({
    name: "Concurrent Name",
    chNameCount: "-2147483648",
    gold: 200n,
  });
  expect(await item(uid)).toMatchObject({ count: 2 });
  expect(
    await realm()
      .db.select()
      .from(nickname_change)
      .where(eq(nickname_change.operationId, operationId)),
  ).toHaveLength(1);
});

test("realm authorization and inventory SQL failures cannot authorize a gold fallback", async () => {
  const uid = await seed({ items: 1 });
  const config = {
    ...configuration,
    price: () => {
      throw new Error("Price must not be reached");
    },
  };
  await realm().db.update(userprofile).set({ banFlag: 1 }).where(eq(userprofile.uid, uid));
  await expect(store(1, config).change(uid, randomUUID(), "Banned Name", now)).rejects.toThrow();
  await realm()
    .db.update(userprofile)
    .set({ banFlag: 0, serverId: 2 })
    .where(eq(userprofile.uid, uid));
  await expect(store(1, config).change(uid, randomUUID(), "Wrong Realm", now)).rejects.toThrow();
  await realm().db.update(userprofile).set({ serverId: 1 }).where(eq(userprofile.uid, uid));
  await realm().pool.query("ALTER TABLE opencok_kingdom.user_item RENAME TO unavailable_user_item");
  try {
    await expect(
      store(1, config).change(uid, randomUUID(), "Inventory Down", now),
    ).rejects.toThrow();
    expect(await profile(uid)).toMatchObject({
      gold: 200n,
      chNameCount: "0",
      name: `Before ${uid}`,
    });
    expect(
      await realm().db.select().from(nickname_change).where(eq(nickname_change.ownerUid, uid)),
    ).toHaveLength(0);
  } finally {
    await realm().pool.query(
      "ALTER TABLE opencok_kingdom.unavailable_user_item RENAME TO user_item",
    );
  }
  expect(await item(uid)).toMatchObject({ count: 1 });
});

test("confirmed global failures restore items and keep the incremented rename counter", async () => {
  const uid = await seed({ account: false, items: 1 });
  const operationId = randomUUID();
  const result = await store().change(uid, operationId, "Missing Account", now);
  expect(result).toMatchObject({ state: "refunded", failureCode: "E100123", pendingEffects: 16 });
  expect(await receipt(operationId)).toBeUndefined();
  expect(await item(uid)).toMatchObject({ count: 1 });
  expect(await profile(uid)).toMatchObject({ chNameCount: "1", name: `Before ${uid}`, gold: 200n });
  expect(await store().recover(uid, operationId, now + 1)).toEqual(result);
  expect(await item(uid)).toMatchObject({ count: 1 });
});

test("refund re-reads price and CN1 ratio while preserving the original debit reply", async () => {
  for (const [pf, ratio, expected] of [
    ["synthetic", 1, 300n],
    ["cn1", 0.5, 200n],
    ["dmm", 1, 200n],
  ] as const) {
    const uid = await seed({ account: false, pf });
    let reads = 0,
      ratios = 0;
    const config = {
      ...configuration,
      price: () => (++reads === 1 ? "100" : "200"),
      refundRatio: async () => {
        ratios++;
        return ratio;
      },
    };
    const result = await store(1, config).change(uid, randomUUID(), `Refund ${uid}`, now);
    expect(result.state).toBe("refunded");
    expect(result.responseGold).toBe(pf === "dmm" ? 150n : 100n);
    expect(await profile(uid)).toMatchObject({
      gold: expected,
      dmmGold: pf === "dmm" ? 200n : 30n,
    });
    expect(reads).toBe(2);
    expect(ratios).toBe(pf === "cn1" ? 1 : 0);
    const payment = nicknameChangePayment(result);
    expect(payment.kind === "gold" && payment.refund?.delta).toBe(
      String(pf === "cn1" ? 100n : 200n),
    );
  }
});

test("unavailable CN1 state and malformed refund price retain a recoverable operation without minting", async () => {
  const uid = await seed({ account: false, pf: "cn1" });
  const operationId = randomUUID();
  let reads = 0,
    ratios = 0,
    validPrice = false,
    available = false;
  const config = {
    ...configuration,
    price: () => (++reads === 1 || validPrice ? "100" : "invalid"),
    refundRatio: async () => {
      ratios++;
      if (!available) throw new Error("State unavailable");
      return 0.5;
    },
  };
  await expect(store(1, config).change(uid, operationId, "CN1 Pending", now)).rejects.toThrow();
  expect(ratios).toBe(0);
  expect(await profile(uid)).toMatchObject({ gold: 100n, chNameCount: "1" });
  expect((await store(1, config).find(uid, operationId))?.state).toBe("prepared");
  validPrice = true;
  await expect(store(1, config).recover(uid, operationId, now + 1)).rejects.toThrow();
  expect(await profile(uid)).toMatchObject({ gold: 100n });
  available = true;
  const result = await store(1, config).recover(uid, operationId, now + 2);
  expect(result.state).toBe("refunded");
  expect(await profile(uid)).toMatchObject({ gold: 150n });
  expect(await store(1, config).recover(uid, operationId, now + 3)).toEqual(result);
  expect(await profile(uid)).toMatchObject({ gold: 150n });
});

test("lost global, payment and final realm commit replies converge without double charge or refund", async () => {
  for (const stage of ["global", "payment", "finish"] as const) {
    const uid = await seed({ items: 2 }),
      operationId = randomUUID();
    const fault = loseCommit(
      stage === "global" ? databases.global.pool : realm().pool,
      stage === "global"
        ? 'insert into "opencok_global"."nickname_change_receipt"'
        : stage === "payment"
          ? 'insert into "opencok_kingdom"."nickname_change"'
          : 'update "opencok_kingdom"."nickname_change"',
    );
    try {
      const result = await store().change(uid, operationId, `Lost ${stage}`, now);
      expect(fault.fired()).toBe(true);
      expect(result.state).toBe(stage === "payment" ? "refunded" : "committed");
      expect(await item(uid)).toMatchObject({ count: stage === "payment" ? 2 : 1 });
      expect(await profile(uid)).toMatchObject({
        chNameCount: "1",
        name: stage === "payment" ? `Before ${uid}` : `Lost ${stage}`,
      });
      expect(Boolean(await receipt(operationId))).toBe(stage !== "payment");
      expect(await store().change(uid, operationId, `Lost ${stage}`, now + 1)).toEqual(result);
    } finally {
      fault.restore();
    }
  }
});

test("SQL failures roll back realm preparation and global receipt writes independently", async () => {
  const uid = await seed({ items: 1 }),
    operationId = randomUUID();
  await realm().pool.query(
    "CREATE TRIGGER reject_nickname BEFORE INSERT ON opencok_kingdom.nickname_change FOR EACH ROW EXECUTE FUNCTION public.reject_nickname()",
  );
  try {
    await expect(store().change(uid, operationId, "Realm Rollback", now)).rejects.toThrow();
    expect(await item(uid)).toMatchObject({ count: 1 });
    expect(await profile(uid)).toMatchObject({ chNameCount: "0", name: `Before ${uid}` });
    expect(await store().find(uid, operationId)).toBeUndefined();
    expect(await receipt(operationId)).toBeUndefined();
  } finally {
    await realm().pool.query("DROP TRIGGER reject_nickname ON opencok_kingdom.nickname_change");
  }
  await databases.global.pool.query(
    "CREATE TRIGGER reject_nickname BEFORE INSERT ON opencok_global.nickname_change_receipt FOR EACH ROW EXECUTE FUNCTION public.reject_nickname()",
  );
  try {
    const result = await store().change(uid, operationId, "Global Rollback", now);
    expect(result).toMatchObject({ state: "refunded", failureCode: "E100179" });
    expect(await item(uid)).toMatchObject({ count: 1 });
    expect(await profile(uid)).toMatchObject({ chNameCount: "1", name: `Before ${uid}` });
    const [account] = await databases.global.db
      .select()
      .from(account_new)
      .where(eq(account_new.gameUid, uid));
    expect(account?.gameUserName).toBe(`Before ${uid}`);
    expect(await receipt(operationId)).toBeUndefined();
  } finally {
    await databases.global.pool.query(
      "DROP TRIGGER reject_nickname ON opencok_global.nickname_change_receipt",
    );
  }
});

test("unreadable or mismatched global evidence leaves the charged operation pending", async () => {
  const uid = await seed({ items: 1 }),
    operationId = randomUUID();
  await realm().pool.query(
    "CREATE TRIGGER reject_nickname BEFORE UPDATE ON opencok_kingdom.nickname_change FOR EACH ROW EXECUTE FUNCTION public.reject_nickname()",
  );
  try {
    await expect(store().change(uid, operationId, "Evidence Name", now)).rejects.toThrow();
  } finally {
    await realm().pool.query("DROP TRIGGER reject_nickname ON opencok_kingdom.nickname_change");
  }
  await databases.global.pool.query(
    "ALTER TABLE opencok_global.nickname_change_receipt RENAME TO unavailable_receipt",
  );
  try {
    await expect(store().recover(uid, operationId, now + 1)).rejects.toThrow();
    expect(await item(uid)).toMatchObject({ count: 0 });
    expect((await store().find(uid, operationId))?.state).toBe("prepared");
  } finally {
    await databases.global.pool.query(
      "ALTER TABLE opencok_global.unavailable_receipt RENAME TO nickname_change_receipt",
    );
  }
  await databases.global.db
    .update(nickname_change_receipt)
    .set({ kingdomId: 2 })
    .where(eq(nickname_change_receipt.operationId, operationId));
  await expect(store().recover(uid, operationId, now + 2)).rejects.toThrow();
  expect(await item(uid)).toMatchObject({ count: 0 });
  expect((await store().find(uid, operationId))?.state).toBe("prepared");
  await databases.global.db
    .update(nickname_change_receipt)
    .set({ kingdomId: 1 })
    .where(eq(nickname_change_receipt.operationId, operationId));
  expect(await store().recover(uid, operationId, now + 3)).toMatchObject({ state: "committed" });
  expect(await profile(uid)).toMatchObject({ name: "Evidence Name", chNameCount: "1" });
  expect(await item(uid)).toMatchObject({ count: 0 });
});

test("global receipt survives PostgreSQL restart and completes a failed realm finalization", async () => {
  const uid = await seed({ items: 1 }),
    operationId = randomUUID();
  await realm().pool.query(
    "CREATE TRIGGER reject_nickname BEFORE UPDATE ON opencok_kingdom.nickname_change FOR EACH ROW EXECUTE FUNCTION public.reject_nickname()",
  );
  try {
    await expect(store().change(uid, operationId, "Restart Name", now)).rejects.toThrow();
    expect((await store().find(uid, operationId))?.state).toBe("prepared");
    expect(await receipt(operationId)).toMatchObject({ newName: "Restart Name" });
    expect(await item(uid)).toMatchObject({ count: 0 });
    expect(await profile(uid)).toMatchObject({ name: `Before ${uid}` });
  } finally {
    await realm().pool.query("DROP TRIGGER reject_nickname ON opencok_kingdom.nickname_change");
  }
  await databases.close();
  await pg.restart();
  databases = createDatabases(pg.options, topology);
  const result = await store().recover(uid, operationId, now + 5);
  expect(result).toMatchObject({ state: "committed", updatedAt: BigInt(now + 5) });
  expect(await profile(uid)).toMatchObject({ name: "Restart Name", chNameCount: "1" });
  expect(await item(uid)).toMatchObject({ count: 0 });
  expect(await store().recover(uid, operationId, now + 6)).toEqual(result);
  expect(
    await realm()
      .db.select()
      .from(nickname_change)
      .where(eq(nickname_change.operationId, operationId)),
  ).toHaveLength(1);
}, 60_000);
