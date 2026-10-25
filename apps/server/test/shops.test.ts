import { expect, test } from "bun:test";
import { Rules, type Rule } from "@opencok/rules/game";
import {
  shopAvailable,
  shopCounters,
  shopLimit,
  shopPrice,
  shopWindow,
} from "@opencok/rules/shops";
import { shopOffer } from "@opencok/mappings/shops";
import type { ShopState, ShopPlan } from "@opencok/contracts/shops";
import { ShopService } from "@opencok/services/shops";
import { sfs, fields } from "@opencok/messages/sfs";

const rules = new Rules(new Map(), new Map(), new Map());
rules.goods.set("200300", { id: "200300", type: "1", para1: "60" });
const offer = {
  id: "offer",
  item_id: "200300",
  onsale: "1",
  sale_type: "10",
  value1_type: "1",
  value1: "10|20|30",
  buy_times_daily: "1|3|0",
};
function state(): ShopState {
  return {
    inventory: {
      profile: {
        uid: "buyer",
        level: 10,
        regTime: 0n,
        gold: 5n,
        paidSpecialGold: 10n,
        paidGold: 100n,
      },
      resource: {},
      items: [],
      cooldowns: new Map(),
      buildings: [{ itemId: 400000, level: 10 }],
      effects: async () => {
        throw new Error("unexpected effects");
      },
    },
    purchases: [],
    stock: [],
    now: 86400000,
  };
}

test("shop tiers price the requested batch at its final daily tier and reject overflow", () => {
  expect(shopPrice(offer, 0, 1).gold).toBe(10);
  expect(shopPrice(offer, 0, 2).gold).toBe(40);
  expect(shopPrice(offer, 3, 1).gold).toBe(30);
  for (const count of [0, -1, 1.5, NaN, 2147483648])
    expect(() => shopPrice(offer, 0, count)).toThrow();
  expect(() => shopPrice({ ...offer, value1: "2147483647" }, 0, 2)).toThrow();
  expect(() => shopPrice({ ...offer, value1_type: "4" }, 0, 1)).toThrow();
  expect(() => shopPrice({ ...offer, value1: "-1" }, 0, 1)).toThrow();
});

test("daily, cycle and server stock limits are independent at exact UTC boundaries", () => {
  const current = state();
  current.purchases = [
    { id: "offer", buyDaily: 2, buyTotal: 5, buyTime: 86399999n, flushTotalTime: 0n },
  ];
  current.stock = [{ id: "offer", purchased: 8n }];
  expect(shopCounters(offer, current)).toMatchObject({ daily: 0, total: 5, server: 8n });
  expect(() => shopLimit({ ...offer, total_times: "8" }, current, 1)).toThrow();
  expect(() => shopLimit({ ...offer, buy_times: "5" }, current, 1)).toThrow();
  const cycle = {
    ...offer,
    buy_times_refresh: "2",
    begin_time: "0",
    times_refresh: "1",
    buy_times_refresh_count: "1",
  };
  expect(shopLimit(cycle, current, 1)).toMatchObject({ total: 0, cycle: 86400000n, server: 8n });
  expect(() => shopLimit(cycle, current, 2)).toThrow();
});

test("shop eligibility enforces catalog, country, castle, version and schedule gates", () => {
  const current = state();
  expect(shopAvailable(offer, current, rules)).toBe(true);
  const denied: Rule[] = [
    { onsale: "0" },
    { level: "11" },
    { castle_level: "11" },
    { version: "99.0.0" },
    { country: "US" },
    { type2: "1" },
    { sale_type: "14" },
    { server: "2" },
    { register: "25" },
  ];
  for (const change of denied)
    expect(shopAvailable({ ...offer, ...change }, current, rules)).toBe(false);
  const scheduled = { ...offer, begin_time: "202601010000", sale_life: "1" };
  const { begin, end } = shopWindow(scheduled);
  expect(shopAvailable(scheduled, { ...current, now: begin - 1 }, rules)).toBe(false);
  expect(shopAvailable(scheduled, { ...current, now: begin }, rules)).toBe(true);
  expect(shopAvailable(scheduled, { ...current, now: end }, rules)).toBe(false);
  const wire = shopOffer(offer, current);
  expect(wire.value1).toEqual(sfs.string("10"));
  expect(wire.beginTime).toEqual(sfs.long(0));
});

test("shop service splits gold pools and preserves both item debit and grant postings", async () => {
  const current = state();
  current.inventory.items = [
    { uuid: "stack", itemId: "200300", count: 4, value: 0, vanishTime: 0n },
  ];
  rules.shops.set("offer", { ...offer, value1: "20", value_item: "200300", value_item_num: "1" });
  let planned: ShopPlan | undefined;
  const service = new ShopService(
    {
      read: async (_, select) => select(current),
      execute: async (_, __, plan) => {
        planned = await plan(current);
        return Buffer.from(planned.inventory.response);
      },
    },
    rules,
  );
  const result = await service.command("buyer", "shoppingMall.buy", {
    id: sfs.string("offer"),
    num: sfs.int(1),
  });
  expect(planned!.inventory.profile).toEqual({ gold: 0n, paidSpecialGold: 0n, paidGold: 95n });
  expect(result.body.gold).toEqual(sfs.long(95));
  expect(fields(result.body.goods).count).toEqual(sfs.int(4));
  expect(
    planned!.inventory.postings
      .filter((posting) => posting.asset === "item.stack")
      .map((posting) => [posting.before, posting.after]),
  ).toEqual([
    [4n, 3n],
    [3n, 4n],
  ]);
  current.inventory.profile = {
    uid: "buyer",
    pf: "dmm",
    gold: 1000n,
    dmmGold: 1n,
    dmmPaidSpecialGold: 9n,
    dmmPaidGold: 10n,
  };
  await service.command("buyer", "shoppingMall.buy", { id: sfs.string("offer"), num: sfs.int(1) });
  expect(planned!.inventory.profile).toEqual({
    dmmGold: 0n,
    dmmPaidSpecialGold: 0n,
    dmmPaidGold: 0n,
  });
  current.inventory.profile = { uid: "buyer", pf: "dmm", gold: 1000n };
  await expect(
    service.command("buyer", "shoppingMall.buy", { id: sfs.string("offer"), num: sfs.int(1) }),
  ).rejects.toThrow();
});
