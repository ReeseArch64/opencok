import { expect, test } from "bun:test";
import { Rules } from "@opencok/rules/game";
import {
  newGeneralBuildingRate,
  type NewGeneralBuildingState,
} from "@opencok/rules/new-general-building";

const context = { kingdomId: 1, version: "12.6.0", now: Date.UTC(2026, 9, 24, 12) };
function fixture() {
  const rules = new Rules(new Map(), new Map(), new Map());
  rules.features.set("general_official", {
    version: "12.6.0",
    online: "1",
    test: "2",
    start: "2026-10-24-12-00",
    end: "2026-10-24-13-00",
  });
  rules.items.set("general_official", { k1: "30", k2: "1.5", k3: "0.25", k4: "-2" });
  const officeRule = {
    unlock: "1;30|2;5|3;20",
    pos_unlock: "1;0;0|2;0;0|3;0;0",
    effect: "78|91",
    unlock_person_num: "1|2",
  };
  rules.power.newGeneralOffices = new Map([["office", officeRule]]);
  const state: NewGeneralBuildingState = {
    buildingUuid: "castle",
    buildingUuids: new Set(["castle", "barracks"]),
    mainBuildingLevel: 30,
    playerLevel: 20,
    prestigeLevel: 5,
    offices: [{ id: 1, officeId: "office", position: 1, startTime: 1n }],
  };
  const general = { id: 1, state: 6 as number | null, buildingUuid: null as string | null };
  return {
    rules,
    state,
    general,
    officeRule,
    resolve: (patch: Partial<typeof context> & { testServer?: boolean } = {}, effect = 78) =>
      newGeneralBuildingRate(general, state, rules, { ...context, ...patch }, effect),
  };
}

test("building lookup absence skips all general and official work; assignment requires state two and an existing matching building", () => {
  const f = fixture();
  f.state.buildingUuid = undefined;
  f.rules.items.clear();
  expect(f.resolve()).toBeUndefined();
  f.state.buildingUuid = "castle";
  f.general.state = 2;
  f.general.buildingUuid = "castle";
  expect(f.resolve({ version: "0.0.0" })).toBe(1);
  f.rules.features.clear();
  f.general.buildingUuid = "barracks";
  expect(f.resolve()).toBeUndefined();
  f.general.buildingUuid = "castle";
  f.state.buildingUuids = new Set();
  expect(f.resolve()).toBeUndefined();
  f.state.buildingUuids = new Set(["castle"]);
  f.general.state = 1;
  expect(f.resolve()).toBeUndefined();
});

test("official eligibility uses owner version, realm and inclusive time gates", () => {
  const f = fixture();
  expect(f.resolve()).toBe(1.5);
  expect(f.resolve({ now: context.now + 3600000 })).toBe(1.5);
  for (const patch of [
    { version: "12.5.99" },
    { kingdomId: 2 },
    { now: context.now - 1 },
    { now: context.now + 3600001 },
  ])
    expect(f.resolve(patch)).toBeUndefined();
  expect(f.resolve({ kingdomId: 2, testServer: true })).toBe(1.5);
  f.rules.features.clear();
  f.rules.items.clear();
  expect(f.resolve()).toBeUndefined();
});

test("official versions preserve Java integer parsing and short-circuit comparison after parsing every supplied part", () => {
  const f = fixture();
  for (const version of ["13", "13.0", ".12..6.0.", "+12.06.００", "12.6.0.99", "12.6.0.-1"])
    expect(f.resolve({ version })).toBe(1.5);
  for (const version of ["11", "12.5", "12.6.-1"]) expect(f.resolve({ version })).toBeUndefined();
  for (const version of ["12", "12.6", "13.bad", "13.0.0.bad", "2147483648.0.0", " 12.6.0"])
    expect(() => f.resolve({ version })).toThrow();
  f.rules.features.get("general_official")!.version = "11";
  expect(f.resolve()).toBe(1.5);
  f.rules.features.get("general_official")!.version = "12";
  expect(() => f.resolve()).toThrow();
});

test("official feature opening checks the main-building level before general state and preserves malformed-config failures", () => {
  const f = fixture();
  f.state.mainBuildingLevel = 29;
  expect(f.resolve()).toBeUndefined();
  f.state.mainBuildingLevel = 30;
  for (const state of [null, 0, 1, 2, 3, 4, 5, 7, -1]) {
    f.general.state = state;
    expect(f.resolve()).toBeUndefined();
  }
  f.rules.items.clear();
  expect(() => f.resolve()).toThrow();
});

test("missing, empty or unstarted office state does not contribute and never repairs saved rows", () => {
  const f = fixture();
  const office = f.state.offices[0]!;
  for (const patch of [
    { officeId: null },
    { officeId: "" },
    { position: 0 },
    { position: null },
    { startTime: 0n },
    { startTime: null },
  ]) {
    f.state.offices = [{ ...office, ...patch }];
    const before = structuredClone(f.state.offices);
    expect(f.resolve()).toBeUndefined();
    expect(f.state.offices).toEqual(before);
  }
  f.state.offices = [];
  expect(f.resolve()).toBeUndefined();
  f.state.offices = [{ ...office, startTime: 9223372036854775807n }];
  expect(f.resolve()).toBe(1.5);
  f.state.offices = [{ ...office, officeId: " " }];
  expect(() => f.resolve()).toThrow();
});

test("office unlocks preserve threshold equality, duplicate keys and permissive unknown condition types", () => {
  const f = fixture();
  for (const field of ["mainBuildingLevel", "playerLevel", "prestigeLevel"] as const) {
    const value = f.state[field];
    f.state[field]--;
    expect(f.resolve()).toBeUndefined();
    f.state[field] = value;
    expect(f.resolve()).toBe(1.5);
  }
  f.officeRule.unlock = "1;999|1;30|0;2147483647|-1;2147483647|99;2147483647";
  expect(f.resolve()).toBe(1.5);
  f.officeRule.unlock = "2;6|2;5";
  expect(f.resolve()).toBe(1.5);
  f.officeRule.unlock = "ignored|2;bad";
  expect(() => f.resolve()).toThrow();
});

test("position unlocks count list entries, parse every numeric token and apply only matching position requirements", () => {
  const f = fixture();
  f.state.offices[0]!.position = 2;
  f.officeRule.pos_unlock = "2;0;0";
  expect(f.resolve()).toBeUndefined();
  f.officeRule.pos_unlock = "1;1;999|3;2;999";
  expect(f.resolve()).toBe(0.25);
  f.officeRule.pos_unlock = "2;3;21|1;0;0";
  expect(f.resolve()).toBeUndefined();
  f.officeRule.pos_unlock = "2;3;20|1;0;0";
  expect(f.resolve()).toBe(0.25);
  f.officeRule.pos_unlock = "2;3;20|1;bad;0";
  expect(() => f.resolve()).toThrow();
  f.officeRule.pos_unlock = "2|1;0";
  expect(f.resolve()).toBe(0.25);
});

test("effect quotas count all restored same-office rows, keep first duplicate IDs and use the first matching effect", () => {
  const f = fixture();
  f.officeRule.unlock_person_num = "2|2";
  expect(f.resolve()).toBeUndefined();
  f.state.offices = [
    ...f.state.offices,
    { id: 2, officeId: "office", position: 0, startTime: 0n },
    { id: 2, officeId: "other", position: 1, startTime: 1n },
  ];
  expect(f.resolve()).toBe(1.5);
  f.officeRule.unlock_person_num = "3|2";
  expect(f.resolve()).toBeUndefined();
  f.officeRule.effect = "78|78";
  f.officeRule.unlock_person_num = "3|1";
  expect(f.resolve()).toBeUndefined();
  f.officeRule.unlock_person_num = "1|bad";
  expect(f.resolve()).toBe(1.5);
  f.officeRule.effect = "91|78";
  f.officeRule.unlock_person_num = "bad|1";
  expect(() => f.resolve()).toThrow();
  f.officeRule.unlock_person_num = "bad";
  expect(f.resolve()).toBeUndefined();
});

test("official multipliers retain direct Float parsing, zero, nonfinite and default-position behavior", () => {
  const f = fixture();
  for (const [position, value] of [
    [1, 1.5],
    [2, 0.25],
    [3, -2],
    [-1, 1],
  ]) {
    f.state.offices[0]!.position = position!;
    expect(f.resolve()).toBe(value!);
  }
  f.state.offices[0]!.position = 1;
  for (const [raw, value] of [
    ["0", 0],
    ["-0", -0],
    ["NaN", NaN],
    ["Infinity", Infinity],
    ["1.000000059604644775390625000001", 1.0000001192092896],
  ] as const) {
    f.rules.items.get("general_official")!.k2 = raw;
    expect(f.resolve()).toBe(value);
  }
  delete f.rules.items.get("general_official")!.k2;
  expect(() => f.resolve()).toThrow();
});

test("bounded official inputs and absent consumed catalogs reject without supplying a false zero rate", () => {
  const f = fixture();
  f.state.offices[0]!.startTime = 9223372036854775808n;
  expect(() => f.resolve()).toThrow();
  f.state.offices[0]!.startTime = 1n;
  f.state.offices[0]!.officeId = "x".repeat(41);
  expect(() => f.resolve()).toThrow();
  f.state.offices[0]!.officeId = "office";
  f.rules.power.newGeneralOffices!.clear();
  expect(() => f.resolve()).toThrow();
  f.state.offices = Array(4097).fill(f.state.offices[0]!);
  expect(() => f.resolve()).toThrow();
});
