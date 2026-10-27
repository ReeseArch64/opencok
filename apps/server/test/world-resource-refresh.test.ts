import { expect, test } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import {
  worldResourceAreaCount,
  worldResourceChoice,
  worldResourceDuration,
  worldResourceQuota,
} from "@opencok/rules/world-resource-refresh";

const rules = await loadRules();

test("maintained normal resource groups expose all four native weighted tables", () => {
  expect([...rules.world.resources!.keys()]).toEqual([
    "resources",
    "resources1",
    "resources2",
    "resources3",
  ]);
  for (const group of rules.world.resources!.values()) {
    expect(group).toHaveLength(310);
    for (const band of Array.from({ length: 21 }, (_, index) => index))
      expect(group.some((rule) => Number(rule.area_level) === band)).toBe(true);
  }
  expect(worldResourceQuota(rules)).toBe(500);
  expect(worldResourceDuration(rules, 1)).toBe(21600000n);
  expect(worldResourceDuration(rules, 1, true)).toBe(3600000n);
});

test("resource creation applies native float capacity effects only to nongold nodes and gates realm age", () => {
  const point = { x: 0, y: 0 };
  const group = [
    { id: "wood", area_level: "20", ratio: "1", res_type: "0", res_level: "1", hours: "1" },
    { id: "gold", area_level: "20", ratio: "1", res_type: "5", res_level: "1", hours: "0" },
  ];
  const effects = new Map([
    [305, 25],
    [307, 75],
  ]);
  expect(worldResourceChoice(rules, group, point, 1201, 0n, effects, false, () => 0)).toEqual({
    type: 5,
    level: 1,
    amount: 10,
  });
  expect(worldResourceChoice(rules, group, point, 1201, 3600000n, effects, false, () => 0)).toEqual(
    { type: 0, level: 1, amount: 70200 },
  );
  expect(
    worldResourceChoice(
      rules,
      group,
      point,
      1201,
      3600000n,
      effects,
      false,
      (maximum) => maximum - 1,
    ),
  ).toEqual({ type: 5, level: 1, amount: 10 });
  expect(
    worldResourceChoice(rules, group, { x: 600, y: 600 }, 1201, 3600000n, effects, false, () => 0),
  ).toBeUndefined();
});

test("normal resource regions retain the Source combined last-row and last-column area", () => {
  expect(worldResourceAreaCount(rules, 1200)).toBe(576);
  expect(worldResourceAreaCount(rules, 1201)).toBe(577);
  expect(worldResourceAreaCount(rules, 100)).toBe(4);
});
