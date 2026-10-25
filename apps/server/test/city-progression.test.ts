import { expect, test } from "bun:test";
import {
  cityAmount,
  cityDuration,
  cityInteger,
  progressionActivityData,
  reducedCityCost,
} from "@opencok/rules/city-progression";

test("city quantities, prices and schedules reject negative values and arithmetic overflow", () => {
  expect(cityInteger("2147483647")).toBe(2147483647);
  expect(cityAmount("9223372036854775807")).toBe(9223372036854775807n);
  for (const value of [-1, 2147483648, 0.5, NaN, Infinity, "", "1e4"])
    expect(() => cityInteger(value)).toThrow();
  for (const value of [-1n, 9223372036854775808n, "NaN"]) expect(() => cityAmount(value)).toThrow();
  expect(cityDuration(60, 100)).toBe(30000n);
  expect(cityDuration(1, 0, 60)).toBe(3000n);
  expect(() => cityDuration(60, -100)).toThrow();
  expect(() => cityDuration(Number.MAX_SAFE_INTEGER, 0)).toThrow();
  expect(reducedCityCost(100n, 10, 50)).toBe(45n);
  expect(reducedCityCost(100n, 200)).toBe(0n);
  expect(() => reducedCityCost(9223372036854775807n)).toThrow();
});

test("versioned activity data preserves paid costs and rejects unsupported refunds", () => {
  const data = {
    schema: 1,
    kind: "upgrade",
    costs: { food: "100", woodbind: "50" },
    items: { "200065": 1 },
    target: { level: 30, star: 1, progress: 0 },
  } as const;
  expect(progressionActivityData(data)).toBe(data);
  expect(progressionActivityData(null)).toBeUndefined();
  for (const invalid of [
    { ...data, schema: 2 },
    { ...data, kind: "unsupported" },
    { ...data, costs: { gold: "10" } },
    { ...data, costs: { wood: "-1" } },
    { ...data, items: { "200065": 0 } },
  ])
    expect(() => progressionActivityData(invalid)).toThrow();
});

test("cancellation refunds only half of actual paid balances after bound-resource consumption", async () => {
  const { loadRules } = await import("@opencok/resources/rules");
  const { cityFixture } = await import("./fixtures/city-progression");
  const { context, balances } = cityFixture(await loadRules());
  context.spend({ wood: 100n }, false);
  expect(balances.get("woodbind")).toBe(0n);
  expect(balances.get("wood")).toBe(950n);
  const data = context.data("upgrade");
  expect(data.costs).toEqual({ woodbind: "50", wood: "50" });
  context.refund(data);
  expect(balances.get("woodbind")).toBe(25n);
  expect(balances.get("wood")).toBe(975n);
  expect(balances.get("gold")).toBe(100000n);
});
