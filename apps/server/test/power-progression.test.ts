import { expect, test } from "bun:test";
import { prestigeEffects, militaryEffects, miracleEffects } from "@opencok/rules/power-progression";
import { Rules } from "@opencok/rules/game";

const context = { now: 1792756800000, kingdomId: 1, version: "12.06.0" };
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
      prestigeLevels: new Map(),
      civilizationFeatures: new Map(),
      militarySkills: new Map(),
      miracleBuffs: new Map(),
      statuses: new Map(),
    },
  );
  for (const id of ["civilization", "miracle_buff", "wr_switch"])
    rules.features.set(id, { id, version: "12.06.0", online: "1" });
  rules.power.prestigeLevels!.set("1", {
    id: "1",
    reputation_point: "0;100",
    reputation_level: "1",
  });
  rules.power.prestigeLevels!.set("2", { id: "2", reputation_point: "100", reputation_level: "2" });
  rules.power.prestigeLevels!.set("3", { id: "3", reputation_point: "0", reputation_level: "3" });
  for (const level of [1, 2, 3])
    rules.power.civilizationFeatures!.set(String(level), {
      id: String(level),
      type: "2",
      reputation_level: String(level),
      effect: `487;${level}|999;0.5|487;${level + 0.5}`,
    });
  return rules;
}

test("prestige effects use current civilization, half-open ranges and last duplicate values", () => {
  const rules = fixture();
  for (const [value, expected] of [
    [-1n, 3.5],
    [0n, 1.5],
    [99n, 1.5],
    [100n, 2.5],
    [9007199254740993n, 2.5],
  ] as const) {
    const prestige = [
      { civilizationType: 1, prestigeValue: 100n },
      { civilizationType: 2, prestigeValue: value },
    ];
    const before = structuredClone(prestige);
    expect(prestigeEffects({ civilizationType: 2 }, prestige, rules, context)).toEqual(
      new Map([
        [487, expected],
        [999, 0.5],
      ]),
    );
    expect(prestige).toEqual(before);
  }
  expect(
    prestigeEffects(
      { civilizationType: 0 },
      [{ civilizationType: 2, prestigeValue: 0n }],
      rules,
      context,
    ).size,
  ).toBe(0);
  expect(
    prestigeEffects(
      { civilizationType: 3 },
      [{ civilizationType: 2, prestigeValue: 0n }],
      rules,
      context,
    ).size,
  ).toBe(0);
});

test("prestige keeps first matching ranges and feature rows without combining later matches", () => {
  const rules = fixture();
  const state = [{ civilizationType: 2, prestigeValue: 50n }];
  rules.power.prestigeLevels!.set("4", {
    id: "4",
    reputation_point: "0;100",
    reputation_level: "2",
  });
  rules.power.civilizationFeatures!.set("4", {
    id: "4",
    type: "2",
    reputation_level: "1",
    effect: "487;99",
  });
  expect(prestigeEffects({ civilizationType: 2 }, state, rules, context).get(487)).toBe(1.5);
  rules.power.civilizationFeatures!.get("1")!.effect = "487;0.1|invalid|487;4;ignored";
  expect(prestigeEffects({ civilizationType: 2 }, state, rules, context).get(487)).toBe(
    Math.fround(0.1),
  );
  delete rules.power.civilizationFeatures!.get("1")!.effect;
  expect(prestigeEffects({ civilizationType: 2 }, state, rules, context).size).toBe(0);
});

test("ordinary prestige effects honor ordered duplicate catalog records instead of the final ID lookup", () => {
  const rules = fixture();
  const state = [{ civilizationType: 2, prestigeValue: 100n }];
  rules.power.prestigeLevelRecords = [
    { id: "same", reputation_point: "100", reputation_level: "3" },
    { id: "same", reputation_point: "100", reputation_level: "2" },
  ];
  rules.power.prestigeLevels!.set("same", rules.power.prestigeLevelRecords[1]!);
  expect(prestigeEffects({ civilizationType: 2 }, state, rules, context).get(487)).toBe(3.5);
  rules.power.prestigeLevelRecords = [];
  expect(() => prestigeEffects({ civilizationType: 2 }, state, rules, context)).toThrow();
});

test("prestige requires open client/realm gates and rejects invalid active numeric state", () => {
  const rules = fixture();
  const profile = { civilizationType: 2 };
  const state = [{ civilizationType: 2, prestigeValue: 50n }];
  expect(prestigeEffects(profile, state, rules, { ...context, version: "12.05.0" }).size).toBe(0);
  expect(prestigeEffects(profile, state, rules, { ...context, kingdomId: 2 }).size).toBe(0);
  for (const prestigeValue of [9007199254740992, 9223372036854775808n, "invalid"])
    expect(() =>
      prestigeEffects(profile, [{ civilizationType: 2, prestigeValue }], rules, context),
    ).toThrow("102192");
  rules.power.prestigeLevels!.clear();
  expect(() => prestigeEffects(profile, state, rules, context)).toThrow("102192");
});

test("prestige ranges retain negative one-sided limits and ignore unmatched range shapes", () => {
  const rules = fixture();
  rules.power.prestigeLevels!.clear();
  rules.power.prestigeLevels!.set("1", {
    id: "1",
    reputation_point: "1;2;3",
    reputation_level: "1",
  });
  rules.power.prestigeLevels!.set("2", { id: "2", reputation_point: "-10", reputation_level: "2" });
  expect(
    prestigeEffects(
      { civilizationType: 2 },
      [{ civilizationType: 2, prestigeValue: -11n }],
      rules,
      context,
    ).get(487),
  ).toBe(2.5);
  expect(
    prestigeEffects(
      { civilizationType: 2 },
      [{ civilizationType: 2, prestigeValue: -10n }],
      rules,
      context,
    ).size,
  ).toBe(0);
});

test("military effects choose the highest positive skill per group and deduplicate skill IDs", () => {
  const rules = fixture();
  for (const [id, group, level, status] of [
    ["1001", "a", "1", "510001"],
    ["1002", "a", "2", "510002"],
    ["2001", "b", "1", "510001"],
    ["3001", "c", "0", "missing"],
  ])
    rules.power.militarySkills!.set(id!, {
      id: id!,
      group: group!,
      level: level!,
      status: status!,
    });
  rules.power.statuses!.set("510001", { id: "510001", effect: "487;5|999;3" });
  rules.power.statuses!.set("510002", { id: "510002", effect: "487;10|487;2" });
  const military = { skill: "1001|1002|1002|2001|3001", status: 0, militaryRank: 0 };
  const before = { ...military };
  expect(militaryEffects(military, rules, context)).toEqual(
    new Map([
      [487, 17],
      [999, 3],
    ]),
  );
  expect(military).toEqual(before);
  rules.features.get("wr_switch")!.version = "99.0.0";
  expect(militaryEffects(military, rules, context).get(487)).toBe(17);
  rules.features.get("wr_switch")!.online = "2";
  expect(militaryEffects(military, rules, context).size).toBe(0);
});

test("military effect totals wrap signed integers and do not accept fractional status bonuses", () => {
  const rules = fixture();
  rules.power.militarySkills!.set("1001", { id: "1001", group: "a", level: "1", status: "510001" });
  rules.power.statuses!.set("510001", { id: "510001", effect: "487;2147483647|487;1" });
  expect(militaryEffects({ skill: "1001" }, rules, context).get(487)).toBe(-2147483648);
  rules.power.statuses!.get("510001")!.effect = "487;0.5";
  expect(() => militaryEffects({ skill: "1001" }, rules, context)).toThrow("102192");
  rules.power.statuses!.clear();
  expect(() => militaryEffects({ skill: "1001" }, rules, context)).toThrow("102192");
  expect(() => militaryEffects({ skill: "missing" }, rules, context)).toThrow("102192");
  expect(militaryEffects(undefined, rules, context).size).toBe(0);
  expect(militaryEffects({ skill: " " }, rules, context).size).toBe(0);
});

test("miracle bonuses match order rather than ID and replace repeated effect definitions", () => {
  const rules = fixture();
  rules.power.miracleBuffs!.set("9001", { id: "9001", order: "4", para: "487;999,0.5|487,2" });
  rules.power.miracleBuffs!.set("4", { id: "4", order: "1", para: "487,99" });
  const miracle = { level: 4 };
  expect(miracleEffects(miracle, rules, context)).toEqual(
    new Map([
      [487, 2],
      [999, 0.5],
    ]),
  );
  expect(miracle).toEqual({ level: 4 });
  rules.power.miracleBuffs!.set("9002", { id: "9002", order: "4", para: "487,3" });
  expect(miracleEffects(miracle, rules, context)).toEqual(new Map([[487, 3]]));
});

test("miracle effects require the client feature gate and active levels without creating records", () => {
  const rules = fixture();
  expect(miracleEffects(undefined, rules, context).size).toBe(0);
  expect(miracleEffects({ level: 0 }, rules, context).size).toBe(0);
  expect(miracleEffects({ level: 4 }, rules, { ...context, version: "12.05.0" }).size).toBe(0);
  expect(() => miracleEffects({ level: 4 }, rules, context)).toThrow("102192");
  rules.power.miracleBuffs!.set("9001", { id: "9001", order: "4" });
  expect(miracleEffects({ level: 4 }, rules, context).size).toBe(0);
  for (const para of ["487,NaN", "487,1e100", "487", "bad,1"]) {
    rules.power.miracleBuffs!.get("9001")!.para = para;
    expect(() => miracleEffects({ level: 4 }, rules, context)).toThrow("102192");
  }
});
