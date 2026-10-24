import { expect, test } from "bun:test";
import type { Row } from "@opencok/contracts/rows";
import { heroEffects, dragonSkillEffects, selectHeroes } from "@opencok/rules/power-companions";
import { Rules } from "@opencok/rules/game";

const context = { kingdomId: 1, version: "12.06.0", now: Date.UTC(2026, 9, 23, 12) };
function fixture() {
  const rules = new Rules(
    new Map(),
    new Map(),
    new Map(),
    new Map(),
    new Map(),
    new Map(),
    new Map(),
    new Map(),
    1,
    new Map(),
    {},
    {
      heroes: new Map(),
      activityEvents: new Map(),
      dragonSkills: new Map(),
    },
  );
  rules.power.activityEvents!.set("9005005", {
    id: "9005005",
    k1: "2026-10-23-12-00",
    k2: "2026-10-23-12-01",
  });
  for (const id of ["dragon_new", "dragon_levelup"])
    rules.features.set(id, { id, version: "99.0.0", online: "1" });
  return rules;
}

test("hero duplicates select highest level then experience and retain the last exact tie without deletion", () => {
  const heroes: Row[] = [
    { heroid: 7001, level: 1, exp: 999 },
    { heroid: 7002, level: 2, exp: 10 },
    { heroid: 7101, level: 1, exp: 0 },
    { heroid: 7003, level: 2, exp: 20 },
    { heroid: 7004, level: 2, exp: 20 },
  ];
  const before = structuredClone(heroes);
  expect(selectHeroes(heroes)).toEqual([heroes[2]!, heroes[4]!]);
  expect(heroes).toEqual(before);
  expect(selectHeroes([])).toEqual([]);
});

test("hero effects read contiguous parameter slots, accumulate duplicates and preserve per-hero float sums", () => {
  const rules = fixture();
  rules.power.heroes!.set("7002", {
    id: "7002",
    para1: "487;10|999;1|487;2",
    para2: "",
    para3: "487;0.5",
    para5: "487;999",
  });
  rules.power.heroes!.set("7101", { id: "7101", para1: "487;1.25" });
  const heroes = [
    { heroid: 7001, level: 1, exp: 999 },
    { heroid: 7002, level: 2, exp: 0 },
    { heroid: 7101, level: 1, exp: 0 },
  ];
  expect(heroEffects(heroes, rules, context)).toEqual(
    new Map([
      [487, 13.75],
      [999, 1],
    ]),
  );
  rules.power.heroes!.get("7002")!.para1 = "487;16777216|487;1|487;1";
  delete rules.power.heroes!.get("7002")!.para3;
  rules.power.heroes!.get("7101")!.para1 = "487;0";
  expect(heroEffects(heroes, rules, context).get(487)).toBe(16777216);
});

test("hero activity has inclusive calendar boundaries and a closed default at contemporary times", () => {
  const rules = fixture();
  const heroes = [{ heroid: 7001 }];
  rules.power.heroes!.set("7001", { id: "7001", para1: "487;5" });
  expect(heroEffects(heroes, rules, { ...context, now: context.now - 1 }).size).toBe(0);
  expect(heroEffects(heroes, rules, context).get(487)).toBe(5);
  expect(heroEffects(heroes, rules, { ...context, now: context.now + 60000 }).get(487)).toBe(5);
  expect(heroEffects(heroes, rules, { ...context, now: context.now + 60001 }).size).toBe(0);
  expect(heroEffects(heroes, rules, { ...context, utcOffsetMinutes: 180 }).size).toBe(0);
  rules.power.activityEvents!.get("9005005")!.k2 = "2026-02-30-12-00";
  expect(heroEffects(heroes, rules, context).size).toBe(0);
  rules.power.activityEvents!.clear();
  expect(heroEffects(heroes, rules, context).size).toBe(0);
});

test("active hero data requires a valid catalog while inactive activity skips the dependency", () => {
  const rules = fixture();
  expect(() => heroEffects([{ heroid: 7001 }], rules, context)).toThrow("102192");
  for (const para1 of ["487;NaN", "487", "invalid;1", "487;1e100"]) {
    rules.power.heroes!.set("7001", { id: "7001", para1 });
    expect(() => heroEffects([{ heroid: 7001 }], rules, context)).toThrow("102192");
  }
  rules.power.activityEvents!.clear();
  expect(heroEffects([{ heroid: 7001 }], rules, context).size).toBe(0);
});

test("dragon effects use active mature owners, unlocked passive skills and latest occupied slots", () => {
  const rules = fixture();
  rules.power.dragonSkills!.set("8001", {
    id: "8001",
    type: "1",
    unlock_lv: "5",
    init_Lv: "1",
    base: "487;2|999;1",
    base_add: "0.5|1",
    boost_effect: "1;487;3|2;487;4|3;487;99|invalid",
  });
  rules.power.dragonSkills!.set("8002", { id: "8002", type: "2", unlock_lv: "0" });
  rules.power.dragonSkills!.set("8003", { id: "8003", type: "1", unlock_lv: "6" });
  const dragons: Row[] = [
    { itemId: 6001, dragonState: 3, lv: 5, useFlag: 1 },
    { itemId: 6002, dragonState: 3, lv: 5, useFlag: 0 },
    { itemId: 6003, dragonState: 2, lv: 5, useFlag: 1 },
  ];
  const skills: Row[] = [
    { ownerId: 6001, index1: 0, skillId: "missing" },
    { ownerId: 6001, index1: 0, skillId: "8001", level: 3, strengthenLevel: 2 },
    { ownerId: 6001, index1: 1, skillId: "8002" },
    { ownerId: 6001, index1: 2, skillId: "8003" },
    { ownerId: 6002, index1: 0, skillId: "missing" },
    { ownerId: 6003, index1: 0, skillId: "missing" },
    { ownerId: 9999, index1: 0, skillId: "missing" },
  ];
  const before = structuredClone({ dragons, skills });
  expect(dragonSkillEffects(dragons, skills, rules, context)).toEqual(
    new Map([
      [487, 10],
      [999, 3],
    ]),
  );
  expect({ dragons, skills }).toEqual(before);
  rules.features.delete("dragon_levelup");
  expect(dragonSkillEffects(dragons, skills, rules, context).size).toBe(0);
});

test("dragon skill arithmetic retains double precision and signed level subtraction", () => {
  const rules = fixture();
  const dragons = [{ itemId: 6001, dragonState: 3, lv: 5, useFlag: 1 }];
  const skills = [{ ownerId: 6001, index1: 0, skillId: "8001", level: 2, strengthenLevel: 1 }];
  rules.power.dragonSkills!.set("8001", {
    id: "8001",
    type: "1",
    unlock_lv: "0",
    init_Lv: "1",
    base: "487;16777216",
    base_add: "1",
    boost_effect: "1;487;0.25",
  });
  expect(dragonSkillEffects(dragons, skills, rules, context).get(487)).toBe(16777217.25);
  rules.power.dragonSkills!.get("8001")!.base = "487;0";
  skills[0]!.level = -2147483648;
  skills[0]!.strengthenLevel = 0;
  expect(dragonSkillEffects(dragons, skills, rules, context).get(487)).toBe(2147483647);
});

test("dragon skill contributions group per dragon before the final double accumulation", () => {
  const rules = fixture();
  const dragons = [6001, 6002].map((itemId) => ({ itemId, dragonState: 3, lv: 5, useFlag: 1 }));
  rules.power.dragonSkills!.set("8001", {
    id: "8001",
    type: "1",
    unlock_lv: "0",
    init_Lv: "1",
    base: "487;10000000000000000|487;1",
    base_add: "0|0",
  });
  rules.power.dragonSkills!.set("8002", {
    id: "8002",
    type: "1",
    unlock_lv: "0",
    init_Lv: "1",
    base: "487;-10000000000000000|487;1",
    base_add: "0|0",
  });
  const skills = [
    { ownerId: 6001, index1: 0, skillId: "8001", level: 1 },
    { ownerId: 6002, index1: 0, skillId: "8002", level: 1 },
  ];
  expect(dragonSkillEffects(dragons, skills, rules, context).get(487)).toBe(0);
});

test("active dragon skills reject missing rules, incomplete vectors and nonfinite arithmetic", () => {
  const rules = fixture();
  const dragons = [{ itemId: 6001, dragonState: 3, lv: 5, useFlag: 1 }];
  const skills = [{ ownerId: 6001, index1: 0, skillId: "8001", level: 1 }];
  expect(() => dragonSkillEffects(dragons, skills, rules, context)).toThrow("102192");
  rules.power.dragonSkills!.set("8001", {
    id: "8001",
    type: "1",
    unlock_lv: "0",
    init_Lv: "1",
    base: "487;1|999;1",
    base_add: "1",
  });
  expect(() => dragonSkillEffects(dragons, skills, rules, context)).toThrow("102192");
  rules.power.dragonSkills!.get("8001")!.base = "487;1e999";
  expect(() => dragonSkillEffects(dragons, skills, rules, context)).toThrow("102192");
});

test("hero activity date failures reset both endpoints and skip the second parse after an invalid start", () => {
  const rules = fixture();
  const heroes = [{ heroid: 7001 }];
  rules.power.heroes!.set("7001", { para1: "487;5" });
  const event = rules.power.activityEvents!.get("9005005")!;
  event.k1 = "2026-9-53-12-00suffix";
  expect(heroEffects(heroes, rules, context).get(487)).toBe(5);
  event.k2 = "bad";
  expect(heroEffects(heroes, rules, context).size).toBe(0);
  expect(heroEffects(heroes, rules, { ...context, now: 0 }).get(487)).toBe(5);
  event.k1 = "bad";
  Object.defineProperty(event, "k2", {
    get: () => {
      throw new Error("Unused end date");
    },
  });
  expect(heroEffects(heroes, rules, { ...context, now: 0 }).get(487)).toBe(5);
  expect(heroEffects(heroes, rules, context).size).toBe(0);
  rules.power.activityEvents!.set("9005005", { k1: "2026-10-23-12-00" });
  expect(() => heroEffects(heroes, rules, context)).toThrow();
  rules.power.activityEvents!.clear();
  expect(heroEffects(heroes, rules, { ...context, now: 0 }).get(487)).toBe(5);
});

test("hero date pairs retain their reused formatter calendar across the Gregorian cutover", () => {
  const rules = fixture();
  const heroes = [{ heroid: 7001 }];
  rules.power.heroes!.set("7001", { para1: "487;5" });
  rules.power.activityEvents!.set("9005005", {
    k1: "1000-1-1-0-0",
    k2: "1582--138983-4230550-0-0",
  });
  expect(heroEffects(heroes, rules, { ...context, now: -12223958400000 }).get(487)).toBe(5);
  expect(heroEffects(heroes, rules, { ...context, now: -12223958399999 }).size).toBe(0);
});
