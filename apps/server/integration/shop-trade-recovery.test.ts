import { expect, test } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { npc_trade } from "@opencok/drizzle/schema/opencok_kingdom/npc_trade";
import { economy_posting } from "@opencok/drizzle/schema/opencok_kingdom/economy_posting";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { command_receipt } from "@opencok/drizzle/schema/opencok_kingdom/command_receipt";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
import { createTradeExecutor } from "@opencok/repositories/trade";
import { TradeService } from "@opencok/services/trade";
import type { Rule } from "@opencok/rules/game";
import { sfs } from "@opencok/messages/sfs";
import { shopHarness } from "./support/shops";

test("shop reads and rejected offers preserve all economic state, receipts and outbox", async () => {
  const h = await shopHarness();
  try {
    const before = await h.snapshot();
    for (const [command, params] of [
      ["mall.info", {}],
      ["mall.info.type", { type: sfs.string("10") }],
      ["mall.data", { mallId: sfs.string("10") }],
    ] as const) {
      const view = await h.shops.command("buyer", command, params);
      expect(view.body.shoppingMall!.value).toHaveLength(1);
    }
    expect(await h.snapshot()).toEqual(before);
    const unsupported: Rule[] = [
      { value1: "101" },
      { value_item: "200300", value_item_num: "9" },
      { value1_type: "2" },
      { value2_type: "3", value2: "1" },
      { type2: "1" },
      { sale_type: "13" },
      { sale_type: "14" },
      { sale_type: "19" },
      { military_rank: "1" },
      { svip_shop_level: "1" },
      { prestige_level: "1" },
      { exp: "1" },
      { discount: "1" },
      { value1: "0" },
      { value_item: "missing", value_item_num: "1" },
    ];
    for (const change of unsupported) {
      h.rules.shops.set(h.offer.id, { ...h.offer, ...change });
      await expect(h.buy()).rejects.toThrow();
      expect(await h.snapshot()).toEqual(before);
    }
    h.rules.shops.set(h.offer.id, { ...h.offer, version: "12.06.0" });
    await h.db.db
      .update(userprofile)
      .set({ appVersion: "6.12.20" })
      .where(eq(userprofile.uid, "buyer"));
    const oldClient = await h.snapshot();
    expect((await h.shops.command("buyer", "mall.info", {})).body.shoppingMall!.value).toHaveLength(
      0,
    );
    await expect(h.buy()).rejects.toThrow();
    expect(await h.snapshot()).toEqual(oldClient);
    h.rules.shops.set(h.offer.id, { ...h.offer, value_item: "200300", value_item_num: "1" });
    await h.db.db
      .update(user_item)
      .set({ vanishTime: BigInt(h.clock.now) })
      .where(eq(user_item.uuid, "source"));
    const expired = await h.snapshot();
    await expect(h.buy()).rejects.toThrow();
    expect(await h.snapshot()).toEqual(expired);
  } finally {
    await h.close();
  }
}, 120000);

test("NPC exchange failures roll back consumption, delivery, offers, postings, receipts and outbox", async () => {
  const h = await shopHarness();
  try {
    await h.trade.command("buyer", "trade.info", {});
    const before = await h.snapshot();
    for (const table of ["economy_posting", "mutation_outbox", "command_receipt"]) {
      await h.db.pool.query(
        `create function reject_trade_write() returns trigger language plpgsql as $$ begin raise exception 'synthetic trade rollback'; end $$`,
      );
      await h.db.pool.query(
        `create trigger reject_trade_write before insert on opencok_kingdom.${table} for each row execute function reject_trade_write()`,
      );
      await expect(h.exchange()).rejects.toThrow();
      expect(await h.snapshot()).toEqual(before);
      await h.db.pool.query(`drop trigger reject_trade_write on opencok_kingdom.${table}`);
      await h.db.pool.query(`drop function reject_trade_write()`);
    }
    await h.db.db.update(user_item).set({ count: 1 }).where(eq(user_item.uuid, "source"));
    const insufficient = await h.snapshot();
    await expect(h.exchange()).rejects.toThrow();
    expect(await h.snapshot()).toEqual(insufficient);
    await h.db.db
      .update(user_item)
      .set({ count: 8, vanishTime: BigInt(h.clock.now) })
      .where(eq(user_item.uuid, "source"));
    const expired = await h.snapshot();
    await expect(h.exchange()).rejects.toThrow();
    expect(await h.snapshot()).toEqual(expired);
    await h.db.db.update(user_item).set({ vanishTime: 0n }).where(eq(user_item.uuid, "source"));
    h.rules.power.equipment!.set("synthetic-equip", { id: "synthetic-equip" });
    h.rules.goods.set("200301", { ...h.rules.goods.get("200301")!, para1: "synthetic-equip" });
    const equipment = await h.snapshot();
    await expect(h.exchange()).rejects.toThrow();
    expect(await h.snapshot()).toEqual(equipment);
    await h.trade.command("buyer", "trade.cancel", {});
    const canceled = await h.snapshot();
    await expect(h.trade.command("buyer", "trade.info", {})).rejects.toThrow();
    expect(await h.snapshot()).toEqual(canceled);
  } finally {
    await h.close();
  }
}, 120000);

test("mixed shop costs, stock, ledger and outbox commit once and roll back together on persistence failure", async () => {
  const h = await shopHarness();
  try {
    h.rules.shops.set(h.offer.id, { ...h.offer, value_item: "200300", value_item_num: "2" });
    const before = await h.snapshot();
    for (const table of ["economy_posting", "mutation_outbox", "command_receipt"]) {
      await h.db.pool.query(
        `create function reject_shop_write() returns trigger language plpgsql as $$ begin raise exception 'synthetic shop rollback'; end $$`,
      );
      await h.db.pool.query(
        `create trigger reject_shop_write before insert on opencok_kingdom.${table} for each row execute function reject_shop_write()`,
      );
      await expect(h.buy()).rejects.toThrow();
      expect(await h.snapshot()).toEqual(before);
      await h.db.pool.query(`drop trigger reject_shop_write on opencok_kingdom.${table}`);
      await h.db.pool.query(`drop function reject_shop_write()`);
    }
    const id = randomUUID();
    await Promise.all(Array.from({ length: 8 }, () => h.buy(id)));
    expect((await h.db.db.select().from(userprofile))[0]!.gold).toBe(90n);
    expect(
      (await h.db.db.select().from(user_item).where(eq(user_item.uuid, "source")))[0]!.count,
    ).toBe(6);
    expect(
      (await h.db.db.select().from(user_item).where(eq(user_item.itemId, "200301")))[0]!.count,
    ).toBe(1);
    expect((await h.db.db.select().from(economy_posting)).map((row) => row.delta).sort()).toEqual([
      -10n,
      -2n,
      1n,
    ]);
    expect((await h.db.db.select().from(mutation_outbox))[0]!.eventType).toBe("shop.purchased");
    expect(await h.db.db.select().from(mutation_outbox)).toHaveLength(1);
    expect(await h.db.db.select().from(command_receipt)).toHaveLength(1);
  } finally {
    await h.close();
  }
}, 120000);

test("NPC lost replies, restart and stale owners preserve a single committed exchange", async () => {
  const h = await shopHarness();
  try {
    const offer = await h.trade.command("buyer", "trade.info", {});
    expect(offer.body.superValue).toEqual(sfs.int(1));
    const executor = createTradeExecutor(h.db.db, h.authority, h.now);
    let lost = true;
    const unreliable = new TradeService(async (...args) => {
      const result = await executor(...args);
      if (lost) {
        lost = false;
        throw new Error("synthetic lost trade reply");
      }
      return result;
    }, h.rules);
    const id = randomUUID();
    const params = { operationId: sfs.string(id) };
    await expect(unreliable.command("buyer", "trade.exchange", params)).rejects.toThrow(
      "synthetic lost trade reply",
    );
    const committed = await h.snapshot();
    await unreliable.command("buyer", "trade.exchange", params);
    expect(await h.snapshot()).toEqual(committed);
    expect((await h.db.db.select().from(npc_trade))[0]!.num).toBe(1);
    expect(
      (await h.db.db.select().from(user_item).where(eq(user_item.uuid, "source")))[0]!.count,
    ).toBe(6);
    expect(
      (await h.db.db.select().from(user_item).where(eq(user_item.itemId, "200301")))[0]!.count,
    ).toBe(3);
    expect((await h.db.db.select().from(economy_posting)).map((row) => row.delta).sort()).toEqual([
      -2n,
      3n,
    ]);
    expect(
      (await h.db.db.select().from(mutation_outbox)).filter((row) => row.requestId === id),
    ).toHaveLength(1);
    expect(
      (await h.db.db.select().from(command_receipt)).filter((row) => row.requestId === id),
    ).toHaveLength(1);
    await expect(h.trade.command("buyer", "trade.cancel", params)).rejects.toThrow();
    expect(await h.snapshot()).toEqual(committed);
    await h.restart();
    const next = await acquireRealmAuthority(h.db.db, 1, () => true);
    const restored = new TradeService(createTradeExecutor(h.db.db, next, h.now), h.rules);
    h.rules.trades.clear();
    const replay = await restored.command("buyer", "trade.exchange", params);
    expect(replay.body.addItem).toBeDefined();
    expect(await h.snapshot()).toEqual(committed);
    const stale = new TradeService(createTradeExecutor(h.db.db, h.authority, h.now), h.rules);
    await expect(stale.command("buyer", "trade.exchange", params)).rejects.toThrow();
    await expect(stale.command("buyer", "trade.exchange", {})).rejects.toThrow();
    expect(await h.snapshot()).toEqual(committed);
  } finally {
    await h.close();
  }
}, 120000);

test("NPC offer restoration, cancellation, daily renewal and competing exchanges cannot duplicate grants", async () => {
  const h = await shopHarness();
  try {
    const original = await h.trade.command("buyer", "trade.info", {});
    await h.restart();
    const restored = new TradeService(createTradeExecutor(h.db.db, h.authority, h.now), h.rules);
    const loaded = await restored.command("buyer", "trade.info", {});
    expect(loaded.body.trade).toEqual(original.body.trade);
    await restored.command("buyer", "trade.cancel", {});
    expect((await h.db.db.select().from(npc_trade))[0]!.num).toBe(0);
    expect(await h.db.db.select().from(user_item)).toHaveLength(1);
    await restored.command("buyer", "trade.info", {});
    await Promise.all(
      Array.from({ length: 8 }, () => restored.command("buyer", "trade.exchange", {})),
    );
    expect((await h.db.db.select().from(npc_trade))[0]!.num).toBe(1);
    expect(
      (await h.db.db.select().from(user_item).where(eq(user_item.itemId, "200301")))[0]!.count,
    ).toBe(3);
    await expect(restored.command("buyer", "trade.info", {})).rejects.toThrow();
    h.clock.now = Date.UTC(2026, 0, 6);
    const renewed = await restored.command("buyer", "trade.info", {});
    expect(renewed.body.times).toEqual(sfs.int(0));
    expect(renewed.body.trade).toEqual(original.body.trade);
    expect((await h.db.db.select().from(npc_trade))[0]!.time).toBe(BigInt(h.clock.now));
  } finally {
    await h.close();
  }
}, 120000);
