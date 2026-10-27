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
import { planInventoryGrants } from "@opencok/services/inventory";
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

test("weekly offers use the selected UTC weekday and publish its daily window", () => {
  const monday = Date.UTC(2026, 0, 5);
  const weekly = { ...offer, onsale_type: "2", begin_time: "2,4", sale_life: "3" };
  expect(shopAvailable(weekly, { ...state(), now: monday }, rules)).toBe(true);
  expect(shopAvailable(weekly, { ...state(), now: monday + 3 * 3600000 }, rules)).toBe(false);
  expect(shopAvailable(weekly, { ...state(), now: monday + 86400000 }, rules)).toBe(false);
  expect(shopAvailable(weekly, { ...state(), now: monday + 2 * 86400000 }, rules)).toBe(true);
  const view = shopOffer(weekly, { ...state(), now: monday + 3600000 });
  expect(view.beginTime).toEqual(sfs.long(BigInt(monday)));
  expect(view.endTime).toEqual(sfs.long(BigInt(monday + 3 * 3600000)));
  for (const begin_time of ["0", "8", "1,,2", "1;2"])
    expect(() => shopWindow({ ...weekly, begin_time }, monday)).toThrow();
  expect(() => shopWindow({ ...weekly, buy_times_refresh: "2" }, monday)).toThrow();
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

test("shop version eligibility uses the saved client version", () => {
  const current = state();
  const versioned = { ...offer, version: "9.27.0" };
  current.inventory.profile = { ...current.inventory.profile, appVersion: "6.12.20" };
  expect(shopAvailable(versioned, current, rules)).toBe(false);
  current.inventory.profile = { ...current.inventory.profile, appVersion: "9.27.0" };
  expect(shopAvailable(versioned, current, rules)).toBe(true);
  expect(shopAvailable({ ...versioned, version: "12.06.0" }, current, rules)).toBe(false);
});

test("unsupported shop currencies, effects and equipment cannot appear as ordinary inventory offers", () => {
  const local = new Rules(new Map(), new Map(), new Map());
  local.goods.set("200300", { id: "200300" });
  local.goods.set("200301", { id: "200301", para1: "equipment" });
  local.goods.set("1000000", { id: "1000000" });
  local.power.equipment = new Map([["equipment", { id: "equipment" }]]);
  const current = state();
  for (const type of [2, 3, 4, 5, 6, 7, 8, 9, 10]) {
    expect(() => shopAvailable({ ...offer, value1_type: String(type) }, current, local)).toThrow();
    expect(() =>
      shopAvailable({ ...offer, value2_type: String(type), value2: "1" }, current, local),
    ).toThrow();
  }
  const unsupported: Rule[] = [
    { type2: "1" },
    { sale_type: "13" },
    { sale_type: "14" },
    { sale_type: "19" },
    { military_rank: "1" },
    { svip_shop_level: "1" },
    { prestige_level: "1" },
    { exp: "1" },
    { discount: "1" },
    { item_id: "200301" },
    { value_item: "200301", value_item_num: "1" },
    { value_item: "1000000", value_item_num: "1" },
    { value_item: "missing", value_item_num: "1" },
    { value_item: "200300", value_item_num: "0" },
    { value1: "0" },
  ];
  for (const change of unsupported)
    expect(shopAvailable({ ...offer, ...change }, current, local)).toBe(false);
  expect(
    shopAvailable(
      { ...offer, value1: "0", value_item: "200300", value_item_num: "1" },
      current,
      local,
    ),
  ).toBe(true);
});

test("shop and trade grants cannot spend or revive a stack at its expiry deadline", () => {
  const current = state();
  current.inventory.items = [
    { uuid: "expired", itemId: "200300", count: 4, value: 0, vanishTime: BigInt(current.now) },
  ];
  expect(() =>
    planInventoryGrants(current.inventory, rules, [], current.now, [
      { itemId: "200300", count: 1 },
    ]),
  ).toThrow();
  const plan = planInventoryGrants(
    current.inventory,
    rules,
    [{ itemId: "200300", count: 1 }],
    current.now,
  );
  expect(plan.items).toHaveLength(1);
  expect(plan.items[0]!.uuid).not.toBe("expired");
  expect(plan.items[0]!.count).toBe(1);
  current.inventory.items = [
    { ...current.inventory.items[0]!, vanishTime: BigInt(current.now + 1) },
  ];
  expect(
    planInventoryGrants(current.inventory, rules, [], current.now, [{ itemId: "200300", count: 1 }])
      .items[0]!.count,
  ).toBe(3);
});
