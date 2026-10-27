import { test, expect } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import { generalRecruit } from "@opencok/hero/rules/general-progression";
import { generalCombatSnapshot, captureGeneral } from "@opencok/hero/services/general-combat";
import { cityFixture } from "./fixtures/city-progression";
const rules = await loadRules();
test("combat snapshots compose each source once, gate factions, and reject absent assignments", () => {
  rules.power.newGeneralBases!.set("53500", {
    ...rules.power.newGeneralBases!.get("53500")!,
    base_star: "1",
    base_skill: "990001;990002",
    faction: "1",
  });
  rules.power.newGeneralSkills!.set("990001", { type: "0", para1: "50", base: "10", add: "1" });
  rules.power.newGeneralSkills!.set("990002", {
    type: "0",
    condition_type: "1",
    para1: "50",
    base: "3",
    add: "2",
  });
  const f = cityFixture(rules),
    row = { ...generalRecruit(rules, 53500, "owner", 1n), state: 3, baseSkill: "990002;2" };
  f.state.generalRoster = { generals: [row], purchases: [], offices: [], skills: [], statuses: [] };
  expect(generalCombatSnapshot(f.context, 53500, false).effects).toEqual([{ id: 50, value: 10 }]);
  expect(generalCombatSnapshot(f.context, 53500, false, new Set([1])).effects).toEqual([
    { id: 50, value: 15 },
  ]);
  expect(() => generalCombatSnapshot(f.context, 53500, true)).toThrow();
  expect(Object.isFrozen(generalCombatSnapshot(f.context, 53500, false).effects)).toBe(true);
  f.state.generalRoster.generals = [{ ...row, state: 1 }];
  expect(() => generalCombatSnapshot(f.context, 53500, false)).toThrow();
});
test("capture removes city assignments and equipment without duplicating inventory", () => {
  const f = cityFixture(rules),
    row = {
      ...generalRecruit(rules, 53500, "owner", 1n),
      state: 2,
      level: 10,
      buildingUuid: "wood",
    };
  f.state.generalRoster = { generals: [row], purchases: [], offices: [], skills: [], statuses: [] };
  f.state.equipment = [{ uid: "owner", uuid: "sword", itemId: 100, generalid: 53500, on: 0 }];
  captureGeneral(f.context, 53500, "captor", 60);
  expect(f.context.write.generalRoster?.generals?.[0]).toMatchObject({
    state: 4,
    predatoruid: "captor",
    buildingUuid: "",
    killtime: 1060000n,
  });
  expect(f.context.write.equipment).toEqual([
    { uid: "owner", uuid: "sword", itemId: 100, generalid: 0, on: 0 },
  ]);
  expect(f.items.size).toBe(0);
  expect(() => captureGeneral(f.context, 53500, "owner", 60)).toThrow();
});
