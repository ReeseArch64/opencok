import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { eq, sql } from "drizzle-orm";
import { createDatabase } from "@opencok/drizzle";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import {
  createSpecialEventStock,
  createSpecialEventBuyer,
} from "@opencok/repositories/special-event";
import {
  SpecialEventPurchaseService,
  createSpecialEventDomain,
  specialEventOperation,
} from "@opencok/services/special-event";
import { exchange_time } from "@opencok/drizzle/schema/opencok_kingdom/exchange_time";
import { special_event_purchase } from "@opencok/drizzle/schema/opencok_global/special_event_purchase";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { sfs } from "@opencok/messages/sfs";
import type { SpecialEventStock } from "@opencok/contracts/special-event";
import { cityHarness } from "./support/city";
async function fixture() {
  let stock: SpecialEventStock;
  const h = await cityHarness([
    createSpecialEventDomain({
      counts: (...args) => stock.counts(...args),
      find: (...args) => stock.find(...args),
    }),
  ]);
  const closers = [h.close];
  try {
    await h.db.pool.query('CREATE DATABASE "special_global"');
    await h.db.pool.query('CREATE DATABASE "special_second"');
    const second = createDatabase("kingdom", { ...h.connection, database: "special_second" });
    closers.push(second.close);
    await migrate(second.db, {
      migrationsFolder: new URL("../../../packages/drizzle/migrations/kingdom", import.meta.url)
        .pathname,
    });
    await second.db
      .insert(userprofile)
      .values({
        uid: "other",
        serverId: 2,
        name: "Synthetic second realm",
        level: 1,
        exp: 0,
        country: "BR",
      });
    const buyer = createSpecialEventBuyer({
      getKingdom: (id) => {
        if (id === 1) return h.db;
        if (id === 2) return second;
        throw new Error("Unknown synthetic realm");
      },
    });
    const global = createDatabase("global", { ...h.connection, database: "special_global" });
    closers.push(global.close);
    await migrate(global.db, {
      migrationsFolder: new URL("../../../packages/drizzle/migrations/global", import.meta.url)
        .pathname,
    });
    stock = createSpecialEventStock(global.db);
    h.clock.now = Date.UTC(2023, 0, 2, 12);
    h.rules.configuration.payControl!.set("69026", {
      ...h.rules.configuration.payControl!.get("69026")!,
      k2: "all",
      k4: "1",
      k5: "2023-01-01-00-00",
      k6: "2023-01-10-00-00",
    });
    for (const [id, limit] of [
      ["759001", 1],
      ["759002", 10],
    ] as const) {
      const product = { id, type: "500", buy_limit: String(limit) };
      h.rules.advanced.castleExchanges!.set(id, product);
      h.rules.advanced.specialExchanges!.set(id, product);
    }
    const verified = new Map<
      string,
      { owner: string; kingdom: number; product: string; at: bigint }
    >();
    const purchases = new SpecialEventPurchaseService(
      stock,
      h.rules,
      {
        async accepted(input) {
          const proof = verified.get(input.eventId);
          return proof &&
            proof.owner === input.owner &&
            proof.kingdom === input.kingdomId &&
            proof.product === input.exchangeId
            ? { at: proof.at }
            : null;
        },
      },
      () => h.clock.now,
      buyer,
    );
    const reserve = (owner = "owner", realm = 1, product = "759001", eventId = randomUUID()) =>
      purchases.reserve(owner, realm, eventId, product);
    const pay = async (eventId: string) => {
      const row = await stock.find(eventId);
      verified.set(eventId, {
        owner: String(row!.ownerUid),
        kingdom: Number(row!.kingdomId),
        product: String(row!.exchangeId),
        at: BigInt(h.clock.now),
      });
      return purchases.confirm(eventId);
    };
    const deliver = (eventId: string, owner = "owner") =>
      h.command(
        "special.paid",
        { eventId: sfs.string(eventId), operationId: sfs.string(specialEventOperation(eventId)) },
        owner,
      );
    return {
      ...h,
      global,
      stock,
      purchases,
      reserve,
      pay,
      deliver,
      verified,
      async close() {
        await global.close();
        await second.close();
        await h.close();
      },
    };
  } catch (error) {
    for (const close of closers.toReversed()) await close();
    throw error;
  }
}
test("limited offers reserve the last shared unit across realms and require verified payment before counting it", async () => {
  const h = await fixture();
  try {
    const ids = [randomUUID(), randomUUID()];
    const attempts = await Promise.allSettled([
      h.reserve("owner", 1, "759001", ids[0]),
      h.reserve("other", 2, "759001", ids[1]),
    ]);
    expect(attempts.filter((row) => row.status === "fulfilled")).toHaveLength(1);
    const [record] = await h.global.db.select().from(special_event_purchase);
    expect(record!.state).toBe(0);
    await expect(h.purchases.confirm(record!.eventId)).rejects.toThrow();
    expect((await h.stock.find(record!.eventId))!.state).toBe(0);
    h.verified.set(record!.eventId, {
      owner: record!.ownerUid,
      kingdom: record!.kingdomId,
      product: record!.exchangeId,
      at: BigInt(h.clock.now),
    });
    await Promise.all(Array.from({ length: 3 }, () => h.purchases.confirm(record!.eventId)));
    expect((await h.stock.find(record!.eventId))!.state).toBe(1);
    const ui = await h.command("special.ui.state", {});
    expect(ui.body.SpecialEvent_id).toEqual(sfs.array([sfs.string("1"), sfs.string("0")]));
    expect(ui.body.SpecialEvent_num).toEqual(ui.body.SpecialEvent_id);
    expect(await h.db.db.select().from(user_item)).toHaveLength(0);
  } finally {
    await h.close();
  }
}, 120000);
test("cancelled holds release capacity while confirmed purchases retain daily eligibility and immutable identities", async () => {
  const h = await fixture();
  try {
    const id = randomUUID();
    await h.reserve("owner", 1, "759002", id);
    await h.reserve("owner", 1, "759002", id);
    await expect(h.reserve("owner", 1, "759001", id)).rejects.toThrow();
    await expect(h.reserve("owner", 1, "759002")).rejects.toThrow();
    await h.stock.cancel(id);
    await expect(h.reserve("owner", 1, "759002", id)).rejects.toThrow();
    const next = randomUUID();
    await h.reserve("owner", 1, "759002", next);
    await h.pay(next);
    await expect(h.stock.cancel(next)).rejects.toThrow();
    await expect(h.reserve("owner", 1, "759002")).rejects.toThrow();
    h.clock.now += 86400000;
    const tomorrow = randomUUID();
    await h.reserve("owner", 1, "759002", tomorrow);
    await h.pay(tomorrow);
    expect((await h.stock.find(tomorrow))!.purchaseDay).toBe(BigInt(h.clock.now) / 86400000n);
  } finally {
    await h.close();
  }
}, 120000);
test("realm daily delivery commits once, retries after receipt failure and never regresses a later purchase", async () => {
  const h = await fixture();
  try {
    const old = randomUUID();
    await h.reserve("owner", 1, "759002", old);
    await h.pay(old);
    await h.db.db.execute(
      sql`CREATE FUNCTION opencok_kingdom.reject_special_receipt() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic failure'; END $$`,
    );
    await h.db.db.execute(
      sql`CREATE TRIGGER reject_special_receipt BEFORE INSERT ON opencok_kingdom.command_receipt FOR EACH ROW EXECUTE FUNCTION opencok_kingdom.reject_special_receipt()`,
    );
    await expect(h.deliver(old)).rejects.toThrow();
    expect(await h.db.db.select().from(exchange_time)).toHaveLength(0);
    expect(await h.stock.pending(1, BigInt(h.clock.now))).toHaveLength(1);
    await h.db.db.execute(
      sql`DROP TRIGGER reject_special_receipt ON opencok_kingdom.command_receipt`,
    );
    h.clock.now += 86400000;
    const recent = randomUUID();
    await h.reserve("owner", 1, "759002", recent);
    await h.pay(recent);
    await h.deliver(recent);
    await Promise.all(Array.from({ length: 3 }, () => h.deliver(old)));
    const [row] = await h.db.db.select().from(exchange_time);
    expect(row).toMatchObject({ uid: "owner", id: "759002", buyTime: BigInt(h.clock.now) });
    await h.stock.delivered(old, "owner", 1, BigInt(h.clock.now));
    await h.stock.delivered(recent, "owner", 1, BigInt(h.clock.now));
    expect(await h.stock.pending(1, BigInt(h.clock.now))).toHaveLength(0);
    await expect(h.stock.delivered(old, "other", 1, BigInt(h.clock.now))).rejects.toThrow();
    await expect(h.deliver(old, "other")).rejects.toThrow();
  } finally {
    await h.close();
  }
}, 120000);
test("disabled and closed offers remain unavailable while valid delayed payments retain their admitted window", async () => {
  const h = await fixture();
  try {
    const id = randomUUID();
    await h.reserve("owner", 1, "759001", id);
    const paymentAt = BigInt(h.clock.now);
    h.clock.now = Date.UTC(2023, 0, 11);
    expect((await h.command("special.ui.state", {})).body.SpecialEvent_num).toBeUndefined();
    await expect(h.reserve()).rejects.toThrow();
    h.verified.set(id, { owner: "owner", kingdom: 1, product: "759001", at: paymentAt });
    await h.purchases.confirm(id);
    await h.deliver(id);
    expect((await h.db.db.select().from(exchange_time))[0]!.buyTime).toBe(paymentAt);
    const withoutGateway = new SpecialEventPurchaseService(
      h.stock,
      h.rules,
      undefined,
      () => h.clock.now,
    );
    await expect(withoutGateway.confirm(id)).rejects.toThrow();
    expect(
      (
        await h.global.db
          .select()
          .from(special_event_purchase)
          .where(eq(special_event_purchase.eventId, id))
      )[0]!.state,
    ).toBe(1);
  } finally {
    await h.close();
  }
}, 120000);
test("contended stock reservations fail within their lock deadline and do not create a hold", async () => {
  const h = await fixture(),
    held = Promise.withResolvers<void>(),
    release = Promise.withResolvers<void>();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const blocker = h.global.db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(728216,hashtext('759001'))`);
    held.resolve();
    await release.promise;
  });
  try {
    await held.promise;
    timer = setTimeout(() => release.resolve(), 4000);
    const started = performance.now();
    await expect(h.reserve()).rejects.toThrow();
    expect(performance.now() - started).toBeLessThan(3500);
    expect(await h.global.db.select().from(special_event_purchase)).toHaveLength(0);
  } finally {
    clearTimeout(timer);
    release.resolve();
    await blocker;
    await h.close();
  }
}, 120000);
test("admission respects legacy realm purchase timestamps and cannot run without an owned buyer reader", async () => {
  const h = await fixture();
  try {
    await h.db.db
      .insert(exchange_time)
      .values({ uid: "owner", id: "759001", buyTime: BigInt(h.clock.now), beginTime: 0n });
    await expect(h.reserve()).rejects.toThrow();
    expect(await h.global.db.select().from(special_event_purchase)).toHaveLength(0);
    await h.db.db
      .update(exchange_time)
      .set({ buyTime: BigInt(h.clock.now) - 86400000n })
      .where(eq(exchange_time.uid, "owner"));
    await h.reserve();
    const unbound = new SpecialEventPurchaseService(h.stock, h.rules, undefined, () => h.clock.now);
    await expect(unbound.reserve("other", 1, randomUUID(), "759002")).rejects.toThrow();
    expect(await h.global.db.select().from(special_event_purchase)).toHaveLength(1);
  } finally {
    await h.close();
  }
}, 120000);
