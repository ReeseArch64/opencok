import { expect, test } from "bun:test";
import { reconnectFoodRates, settleReconnectFood } from "@opencok/rules/reconnect-resources";
import { reconnectResources } from "@opencok/mappings/reconnect";
import { Rules } from "@opencok/rules/game";
import type { Row } from "@opencok/contracts/rows";
import { decode, encode, fields, sfs } from "@opencok/messages/sfs";

const options = { separateBound: true, protect: false, protectedFood: 0, consumptionRatio: 1 };

test("reconnect upkeep charges each settled interval once and never rewinds its checkpoint", () => {
  const initial = { food: 1000n, foodbind: 100n, lastUpdateTime: 1000n };
  const first = settleReconnectFood(initial, 1100n, { ordinary: 2, bound: 1 }, options);
  expect(first).toEqual({
    food: 700n,
    foodbind: 100n,
    lastUpdateTime: 1100n,
    starvingMillis: 0n,
    foodDelta: -300n,
    boundDelta: 0n,
  });
  const persisted = {
    food: first.food,
    foodbind: first.foodbind,
    lastUpdateTime: first.lastUpdateTime,
  };
  for (const now of [1100n, 1099n]) {
    const retry = settleReconnectFood(persisted, now, { ordinary: 2, bound: 1 }, options);
    expect(retry.food).toBe(700n);
    expect(retry.foodbind).toBe(100n);
    expect(retry.foodDelta).toBe(0n);
    expect(retry.lastUpdateTime).toBe(1100n);
  }
  expect(initial).toEqual({ food: 1000n, foodbind: 100n, lastUpdateTime: 1000n });
});

test("ordinary upkeep respects protected food and bound-consumption rules", () => {
  const initial = { food: 100n, foodbind: 200n, lastUpdateTime: 0n };
  expect(settleReconnectFood(initial, 10n, { ordinary: 20, bound: 0 }, options).foodbind).toBe(
    200n,
  );
  const combined = settleReconnectFood(
    initial,
    10n,
    { ordinary: 20, bound: 0 },
    { ...options, separateBound: false },
  );
  expect(combined.food).toBe(0n);
  expect(combined.foodbind).toBe(100n);
  const protectedResult = settleReconnectFood(
    initial,
    10n,
    { ordinary: 20, bound: 0 },
    { ...options, protect: true, protectedFood: 40 },
  );
  expect(protectedResult.food).toBe(40n);
  expect(protectedResult.foodbind).toBe(200n);
});

test("bound upkeep reports the unfed interval after regular food is consumed", () => {
  const initial = { food: 100n, foodbind: 200n, lastUpdateTime: 0n };
  const result = settleReconnectFood(initial, 1000n, { ordinary: 0, bound: 1 }, options);
  expect(result.food).toBe(0n);
  expect(result.foodbind).toBe(0n);
  expect(result.starvingMillis).toBe(700n);
  expect(
    settleReconnectFood(
      { food: 0n, foodbind: 0n, lastUpdateTime: 1000n },
      2000n,
      { ordinary: 0, bound: 0 },
      options,
    ).starvingMillis,
  ).toBe(1000n);
});

test("army upkeep excludes training and includes field, garrison and PVE counts", () => {
  const rules = new Rules(new Map(), new Map(), new Map());
  rules.arms.set("a", { upkeep: "86400" });
  rules.arms.set("b", { upkeep: "86400", new_arms: "1", arm: "1" });
  const armies: Row[] = [
    { armyId: "a", free: 1, pve: 2, defence: 3, march: 4, train: 9999 },
    { armyId: "b", free: 10 },
  ];
  const rates = reconnectFoodRates(armies, rules, {
    ordinary: 50,
    knight: 0,
    knightByArm: new Map([[1, 50]]),
    consumeBound: true,
  });
  expect(rates.ordinary).toBe(Math.fround(0.005));
  expect(rates.bound).toBe(Math.fround(0.0025));
  expect(
    reconnectFoodRates(armies, rules, {
      ordinary: 150,
      knight: 0,
      knightByArm: new Map(),
      consumeBound: false,
    }),
  ).toEqual({ ordinary: 0, bound: 0 });
});

test("resource views preserve merged signed balances and the legacy conditional bound fields", () => {
  const row = {
    food: -2n,
    foodbind: 1n,
    wood: 9223372036854775807n,
    woodbind: 1n,
    silver: -7,
    chip: -1,
    dragon_food: -2,
  };
  const merged = fields(decode(encode(reconnectResources(row, false))).resource);
  expect(merged.food).toEqual(sfs.long(-1n));
  expect(merged.wood).toEqual(sfs.long(-9223372036854775808n));
  expect(merged.food_bind).toBeUndefined();
  expect(merged.silver).toEqual(sfs.int(-7));
  expect(merged.chip).toEqual(sfs.int(0));
  expect(merged.dragonFood).toEqual(sfs.int(-2));
  const separate = fields(decode(encode(reconnectResources(row, true))).resource);
  expect(separate.food).toEqual(sfs.long(0n));
  expect(separate.food_bind).toEqual(sfs.long(1n));
});
