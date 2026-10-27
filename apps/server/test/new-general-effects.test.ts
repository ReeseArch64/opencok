import { expect, test } from "bun:test";
import { Rules } from "@opencok/rules/game";
import { javaFloat } from "@opencok/rules/java-float";
import {
  newGeneralBuildingEffect,
  type NewGeneralEffectState,
} from "@opencok/hero/rules/new-general-effects";
import type { NewGeneralBuildingState } from "@opencok/hero/rules/new-general-building";
import vectors from "./fixtures/new-general-effect-vectors.json";

const context = { kingdomId: 1, version: "12.6.0", now: 1000 };
function fixture() {
  const rules = new Rules(new Map(), new Map(), new Map());
  for (const name of ["general_official", "general_random_effect"])
    {rules.features.set(name, { version: "1.0.0", online: "all" });}
  rules.items.set("general_official", { k1: "1", k2: "0.5" });
  rules.power.newGeneralBases = new Map([
    ["1", { base_skill: "10" }],
    ["2", { base_skill: "20" }],
  ]);
  rules.power.newGeneralSkills = new Map(
    [10, 11, 20, 21].map((id) => [String(id), { type: "0", para1: "78", base: "1", add: "0" }]),
  );
  rules.power.statuses = new Map([
    ["1", { effect: "78;1" }],
    ["2", { effect: "78;1" }],
  ]);
  rules.power.newGeneralRefinement = new Map([["a", { effect: "78" }]]);
  rules.power.newGeneralOffices = new Map([
    ["office", { pos_unlock: "1;0;0", effect: "78", unlock_person_num: "1" }],
  ]);
  const generals: NewGeneralEffectState[] = [1, 2].map((id) => ({
    id,
    state: id === 1 ? 2 : 6,
    buildingUuid: id === 1 ? "castle" : null,
    star: 1,
    baseSkill: null,
    talent: `${id * 10 + 1};1`,
    refinement: "1;a_1",
    opTime: null,
    statuses: [{ stateId: id, startTime: 0n, endTime: 10000n }],
  }));
  const building: NewGeneralBuildingState = {
    buildingUuid: "castle",
    buildingUuids: new Set(["castle"]),
    mainBuildingLevel: 1,
    playerLevel: 1,
    prestigeLevel: 1,
    offices: [{ id: 2, officeId: "office", position: 1, startTime: 1n }],
  };
  const equipped = [1, 1];
  const calls: string[] = [];
  let now = 1000n;
  return {
    rules,
    generals,
    building,
    equipped,
    calls,
    setNow: (value: bigint) => {
      now = value;
    },
    resolve: () =>
      newGeneralBuildingEffect(
        () => ({ orderedGenerals: generals, building }),
        rules,
        context,
        78,
        (general, effect) => {
          calls.push(`equip:${general.id}:${effect}`);
          return equipped[general.id - 1]!;
        },
        () => {
          calls.push("clock");
          return now++;
        },
      ),
  };
}

function bits(value: number) {
  if (Number.isNaN(value)) {return 2143289344;}
  const bytes = new DataView(new ArrayBuffer(4));
  bytes.setFloat32(0, value);
  return bytes.getInt32(0);
}

test("full building contribution order and official scaling match 600 independent Java 8 primitive vectors", () => {
  expect(vectors).toHaveLength(600);
  for (const vector of vectors) {
    const f = fixture();
    f.rules.items.get("general_official")!.k2 = vector.rate;
    for (const [index, values] of vector.generals.entries()) {
      const id = index + 1;
      f.rules.power.statuses!.get(String(id))!.effect = `78;${values[0]}`;
      f.rules.power.newGeneralSkills!.get(String(id * 10))!.base = values[1]!;
      f.rules.power.newGeneralSkills!.get(String(id * 10 + 1))!.base = values[2]!;
      f.equipped[index] = javaFloat(values[3]);
      f.generals[index]!.refinement = `1;a_${values[4]}`;
    }
    expect(bits(f.resolve())).toBe(vector.bits);
    expect(f.calls).toEqual(["clock", "equip:1:78", "clock", "equip:2:78"]);
  }
});

test("building composition samples one clock per eligible general and does not merge supplied traversal order", () => {
  const f = fixture();
  f.generals[0]!.statuses[0]!.endTime = 1000n;
  f.generals[1]!.statuses[0]!.endTime = 1000n;
  expect(f.resolve()).toBe(7);
  expect(f.calls).toEqual(["clock", "equip:1:78", "clock", "equip:2:78"]);
  f.generals.reverse();
  f.calls.length = 0;
  f.setNow(1000n);
  expect(f.resolve()).toBe(6.5);
  expect(f.calls).toEqual(["clock", "equip:2:78", "clock", "equip:1:78"]);
});

test("ineligible generals skip clocks, skill catalog parsing, refinement and equipment resolution", () => {
  const f = fixture();
  f.generals[0]!.state = 1;
  f.rules.power.newGeneralSkills!.get("10")!.base = "bad";
  f.generals[0]!.refinement = "bad";
  expect(f.resolve()).toBe(2.5);
  expect(f.calls).toEqual(["clock", "equip:2:78"]);
  f.building.buildingUuid = undefined;
  f.calls.length = 0;
  expect(f.resolve()).toBe(0);
  expect(f.calls).toEqual([]);
});

test("fresh saved-level and operation-time restoration fails before filtering ineligible generals", () => {
  for (const patch of [
    { talent: "bad;bad" },
    { baseSkill: "10;bad" },
    { opTime: "1;9223372036854775808" },
    { opTime: " ".repeat(201) },
  ]) {
    const f = fixture();
    f.generals[1]!.state = 1;
    Object.assign(f.generals[1]!, patch);
    expect(f.resolve()).toBe(0);
    expect(f.calls).toEqual([]);
  }
  const duplicate = fixture();
  duplicate.generals.push(duplicate.generals[0]!);
  expect(duplicate.resolve()).toBe(0);
  expect(duplicate.calls).toEqual([]);
});

test("non-refinement failures discard prior generals and preserve the outer zero-on-exception boundary", () => {
  for (const fail of ["status", "skill", "equipment", "office"]) {
    const f = fixture();
    if (fail === "status") {f.rules.power.statuses!.get("2")!.effect = "78;bad";}
    if (fail === "skill") {f.rules.power.newGeneralSkills!.get("20")!.base = "bad";}
    if (fail === "equipment") {f.equipped.pop();}
    if (fail === "office") {f.rules.items.get("general_official")!.k2 = "bad";}
    expect(f.resolve()).toBe(0);
    expect(f.calls.slice(0, 2)).toEqual(["clock", "equip:1:78"]);
  }
  const f = fixture();
  expect(
    newGeneralBuildingEffect(
      () => {
        throw new Error("Synthetic snapshot failure");
      },
      f.rules,
      context,
      78,
      () => {
        throw new Error("Unexpected equipment read");
      },
      () => {
        throw new Error("Unexpected clock read");
      },
    ),
  ).toBe(0);
  expect(
    newGeneralBuildingEffect(
      () => ({ orderedGenerals: f.generals, building: f.building }),
      f.rules,
      context,
      78,
      () => 1,
      () => {
        throw new Error("Synthetic clock failure");
      },
    ),
  ).toBe(0);
});

test("refinement failures preserve the prior subtotal and official scaling, including Float zero and NaN rates", () => {
  const f = fixture();
  f.generals[1]!.refinement = "0;a_100|1;missing_5";
  expect(f.resolve()).toBe(7);
  f.rules.items.get("general_official")!.k2 = "0";
  f.equipped[1] = Infinity;
  expect(f.resolve()).toBeNaN();
  f.equipped[1] = 1;
  expect(f.resolve()).toBe(5);
  f.rules.items.get("general_official")!.k2 = "NaN";
  expect(f.resolve()).toBeNaN();
});

test("composition is read-only and does not silently default a required equipment source", () => {
  const f = fixture();
  const before = structuredClone({ generals: f.generals, building: f.building });
  expect(f.resolve()).toBe(7.5);
  expect({ generals: f.generals, building: f.building }).toEqual(before);
  f.equipped.length = 0;
  expect(f.resolve()).toBe(0);
});
