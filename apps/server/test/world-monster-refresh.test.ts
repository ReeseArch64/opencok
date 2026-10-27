import { expect, test } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import { Rules, type Rule } from "@opencok/rules/game";
import {
  worldMonsterAreaCount,
  worldMonsterQuotas,
  worldBarbarianQuota,
  worldBarbarianChoice,
  worldMonsterFree,
} from "@opencok/rules/world-monster-refresh";
const loaded = await loadRules();
function fixture() {
  const rules = new Rules(new Map(), new Map(), new Map());
  rules.world.fieldMonsterGroups = new Map([
    [
      "refresh",
      [
        { day: "0;2", para1: "100;10", blackland1: "100;20" },
        { day: "2;4", para1: "101;30", blackland1: "101;40" },
      ],
    ],
  ]);
  return rules;
}
test("declared field monster groups retain refresh age tables and Source remainder-area counts", () => {
  expect(loaded.world.fieldMonsterGroups!.get("refresh")!.length).toBeGreaterThan(0);
  expect(loaded.world.fieldMonsterGroups!.get("refresh_event_csmod_boss")!.length).toBeGreaterThan(
    0,
  );
  expect(worldMonsterAreaCount(1201, 35)).toBe(1157);
  expect(worldMonsterAreaCount(1200, 20)).toBe(3600);
  const rules = fixture();
  expect([...worldMonsterQuotas(rules, 0n, false, () => 0)]).toEqual([["100", 10]]);
  expect([...worldMonsterQuotas(rules, 172800000n, false, () => 0)]).toEqual([["101", 30]]);
  expect([...worldMonsterQuotas(rules, 999999999n, false, () => 0)]).toEqual([["101", 30]]);
  rules.items.set("monster_event_config", { k1: "0", k6: "0" });
  expect([...worldMonsterQuotas(rules, 0n, true, () => 0)]).toEqual([["100", 20]]);
  expect(() => worldMonsterQuotas(rules, -1n, false, () => 0)).toThrow();
});
test("Source event division includes boss denominator but the final overwritten slot contains NPC monsters", () => {
  const rules = fixture();
  rules.items.set("function_on2", { k9: "1" });
  rules.items.set("monster_event_config", { k1: "20", k6: "40" });
  for (const [group, id] of [
    ["refresh_event", "200"],
    ["refresh_event_other", "300"],
    ["refresh_event_csmod", "400"],
    ["refresh_event_csmod_boss", "500"],
    ["refresh_event_csmod_npc", "600"],
  ])
    rules.world.fieldMonsterGroups!.set(group!, [{ day: "0;99", para1: `${id};10` }]);
  expect([...worldMonsterQuotas(rules, 0n, false, () => 9)]).toEqual([
    ["100", 4],
    ["200", 2],
    ["400", 1],
    ["600", 1],
    ["300", 1],
  ]);
  rules.world.fieldMonsterGroups!.set("refresh", [{ day: "0;99", para1: "100;0" }]);
  expect(worldMonsterQuotas(rules, 0n, false, () => 0).get("100")).toBe(1);
  expect(() => worldMonsterQuotas(rules, 0n, false, () => 10)).toThrow();
});
test("barbarian quota uses Source float arithmetic and weighted actors use actual catalog health and counter maps", () => {
  expect(worldBarbarianQuota(loaded)).toBe(37);
  const rules = fixture();
  rules.items.set("worldmap_city", { k4: "1" });
  rules.items.set("world_barbarion", { k2: "50", k3: "1.5" });
  rules.world.barbarians = new Map<string, Rule>([
    [
      "7",
      {
        id: "7",
        area_level: "1",
        ratio: "1",
        para1: "300",
        army: "a",
        arm_reward: "107000;3|107100;7",
        life_time: ".1",
      },
    ],
  ]);
  rules.world.armies = new Map([["a", { arm: "107000;13|107100;17" }]]);
  expect(worldBarbarianChoice(rules, { x: 0, y: 0 }, 4, () => 0)).toEqual({
    configId: "7",
    currentHP: 300,
    army: new Map([
      ["107000", 13],
      ["107100", 17],
    ]),
    awards: new Map([
      ["107000", 3],
      ["107100", 7],
    ]),
    duration: 360000n,
  });
  expect(worldBarbarianChoice(rules, { x: 1, y: 1 }, 4, () => 0)).toBeUndefined();
  expect(worldMonsterFree({ pointType: 0, gridType: 2, grid2Type: 0, ownerId: "" })).toBe(true);
  expect(worldMonsterFree({ pointType: 0, gridType: 0, grid2Type: 0 })).toBe(false);
  expect(worldMonsterFree({ pointType: 0, gridType: 0, grid2Type: 0 }, true)).toBe(true);
  expect(worldMonsterFree({ pointType: 0, gridType: 2, runtimeClaimed: 1 })).toBe(false);
  expect(worldMonsterFree({ pointType: 0, gridType: 0, x: 600, y: 600 }, true)).toBe(false);
  expect(worldMonsterFree({ pointType: 0, gridType: 0, x: 593, y: 600 }, true)).toBe(true);
});
