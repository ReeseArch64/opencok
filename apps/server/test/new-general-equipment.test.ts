import { expect, test } from "bun:test";
import { Rules } from "@opencok/rules/game";
import { javaFloat } from "@opencok/rules/java-float";
import {
  newGeneralEquipmentEffects,
  equippedGeneralBuildingEffect,
  type NewGeneralEquipment,
  type NewGeneralEquippedState,
  type NewGeneralEquipmentModifier,
} from "@opencok/rules/new-general-equipment";
import type { NewGeneralBuildingState } from "@opencok/rules/new-general-building";
import vectors from "./fixtures/new-general-equipment-vectors.json";

function fixture() {
  const rules = new Rules(new Map(), new Map(), new Map());
  rules.power.equipment = new Map([["1", { site: "0", color: "2", para1: "78", num1: "2" }]]);
  rules.power.equipmentSets = new Map();
  const equipment: NewGeneralEquipment[] = [{ itemId: 1, extraProperty: "78,3" }];
  const modifiers = new Map<number, number>([
    [214, 10],
    [207, 20],
    [218, 50],
  ]);
  const calls: number[] = [];
  const owner = (id: NewGeneralEquipmentModifier) => {
    calls.push(id);
    return modifiers.get(id) ?? 0;
  };
  return {
    rules,
    equipment,
    modifiers,
    calls,
    owner,
    resolve: (id = 7) => newGeneralEquipmentEffects(id, equipment, rules, owner),
  };
}
function bits(value: number) {
  if (Number.isNaN(value)) return 2143289344;
  const bytes = new DataView(new ArrayBuffer(4));
  bytes.setFloat32(0, value);
  return bytes.getInt32(0);
}

test("general equipment modifiers, extra properties and suit addition match 1000 independent Java 8 Float vectors", () => {
  expect(vectors).toHaveLength(1000);
  for (const vector of vectors) {
    const f = fixture();
    const input = vector.input;
    f.rules.power.equipment!.set("1", {
      site: "0",
      color: "2",
      para1: "78",
      num1: input[0]!,
      suit_id: "s",
    });
    f.rules.power.equipment!.set("2", {
      site: "1",
      color: "2",
      para1: "78",
      num1: input[1]!,
      suit_id: "s",
    });
    f.equipment.splice(
      0,
      1,
      { itemId: 1, extraProperty: `78,${input[2]}` },
      { itemId: 2, extraProperty: `78,${input[3]}` },
    );
    f.modifiers.set(214, javaFloat(input[4]));
    for (const id of [207, 209]) f.modifiers.set(id, javaFloat(input[5]));
    f.modifiers.set(218, javaFloat(input[6]));
    f.rules.power.equipmentSets!.set("s", { suit_para1: "78", suit_num1: input[7]! });
    expect(bits(f.resolve().get(78)!)).toBe(vector.bits);
  }
});

test("color and site modifiers are reread for extras and modifier 218 resolves once per item effect in Integer HashMap order", () => {
  const f = fixture();
  expect(f.resolve().get(78)).toBe(9.75);
  expect(f.calls).toEqual([214, 207, 214, 207, 218]);
  let colorReads = 0;
  expect(
    newGeneralEquipmentEffects(7, f.equipment, f.rules, (id) =>
      id === 214 ? ++colorReads * 100 : 0,
    ).get(78),
  ).toBe(13);
  const siteEffects = [207, 209, 208, 210, 211, 212, 213];
  for (let color = 0; color <= 5; color++)
    for (let site = 0; site <= 6; site++) {
      f.calls.length = 0;
      Object.assign(f.rules.power.equipment!.get("1")!, {
        color: String(color),
        site: String(site),
        para1: "78|91",
        num1: site === 6 ? "2|3" : "2",
      });
      f.equipment[0]!.extraProperty = null;
      f.resolve();
      const one = color >= 2 ? [212 + color, siteEffects[site]!] : [siteEffects[site]!];
      expect(f.calls).toEqual([...one, ...one, 218, 218]);
    }
  const calls: number[] = [];
  f.rules.power.equipment!.set("1", { para1: "78|91", num1: "1" });
  const result = newGeneralEquipmentEffects(7, f.equipment, f.rules, (id) => {
    calls.push(id);
    return calls.length === 1 ? 100 : 0;
  });
  expect([...result]).toEqual([
    [91, 2],
    [78, 1],
  ]);
});

test("negative equipment values remain negative and no player on flag is required for already bound general equipment", () => {
  const f = fixture();
  f.rules.power.equipment!.set("1", { para1: "78|78", num1: "-4" });
  f.equipment[0]!.extraProperty = "78,1";
  f.modifiers.clear();
  const before = structuredClone(f.equipment);
  expect(f.resolve().get(78)).toBe(-7);
  expect(f.equipment).toEqual(before);
  f.rules.power.equipment!.get("1")!.num1 = "-0";
  f.equipment[0]!.extraProperty = null;
  expect(f.resolve().get(78)).toBe(0);
});

test("ordinary parameter groups stop at the first blank and at 99 while canonical dragon sites use parallel values", () => {
  const f = fixture();
  f.modifiers.clear();
  f.equipment[0]!.extraProperty = null;
  f.rules.power.equipment!.set("1", {
    site: "6",
    color: "",
    para1: "|78||91|",
    num1: "|2||3|",
    para2: "bad",
  });
  expect([...f.resolve()]).toEqual([
    [91, 3],
    [78, 2],
  ]);
  f.rules.power.equipment!.get("1")!.site = "+6";
  expect(() => f.resolve()).toThrow();
  f.rules.power.equipment!.get("1")!.num1 = "2";
  expect(() => f.resolve()).toThrow();
  delete f.rules.power.equipment!.get("1")!.para2;
  expect([...f.resolve()]).toEqual([
    [91, 2],
    [78, 2],
  ]);
  f.rules.power.equipment!.set("1", {
    para1: "78",
    num1: "2",
    para2: "\u2000",
    num2: "bad",
    para3: "78",
    num3: "99",
  });
  expect(f.resolve().get(78)).toBe(2);
  const rule: Record<string, string> = { para100: "bad", num100: "bad" };
  for (let i = 1; i < 100; i++) Object.assign(rule, { [`para${i}`]: "78", [`num${i}`]: "1" });
  f.rules.power.equipment!.set("1", rule);
  expect(f.resolve().get(78)).toBe(99);
  f.rules.power.equipment!.set("1", { site: "6" });
  expect(() => f.resolve()).toThrow();
  f.rules.power.equipment!.get("1")!.para1 = "";
  expect(f.resolve().size).toBe(0);
});

test("extra properties preserve Java separator and duplicate behavior without parsing unused comma fields", () => {
  const f = fixture();
  f.rules.power.equipment!.set("1", {});
  f.modifiers.clear();
  f.equipment[0]!.extraProperty = "|78@78@91@,2,ignored||78,3,|@,99|";
  expect([...f.resolve()]).toEqual([
    [91, 2],
    [78, 7],
  ]);
  for (const raw of [
    "78,",
    "78,,2",
    ",2",
    "@78,2",
    "78@@91,2",
    "78,2| ",
    "bad,2",
    "78,bad",
    "x".repeat(256),
  ]) {
    f.equipment[0]!.extraProperty = raw;
    expect(() => f.resolve()).toThrow();
  }
  f.equipment[0]!.extraProperty = "７８,0x1p2F";
  expect(f.resolve().get(78)).toBe(4);
});

test("suit thresholds and exact general exclusivity apply without a feature gate or modifier 218", () => {
  const f = fixture();
  f.equipment.length = 0;
  f.modifiers.clear();
  f.modifiers.set(218, 100);
  f.rules.power.equipmentSets!.set("s", {
    suit_para1: "78",
    suit_num1: "2",
    suit_para2: "78",
    suit_num2: "4",
    suit_para3: "78|78",
    suit_num3: "6",
    suit_hero3: "7,8",
  });
  const expected = [2, 6, 8, 14, 16, 30];
  for (let i = 0; i < 6; i++) {
    f.rules.power.equipment!.set(String(i + 1), {
      site: String(i),
      para1: "78",
      num1: "1",
      suit_id: "s",
    });
    f.equipment.push({ itemId: i + 1, extraProperty: null });
    expect(f.resolve().get(78)).toBe(expected[i]!);
  }
  expect(f.resolve(9).get(78)).toBe(18);
  f.rules.power.equipmentSets!.get("s")!.suit_hero3 = " 7,07";
  expect(f.resolve().get(78)).toBe(18);
  f.rules.power.equipmentSets!.get("s")!.suit_hero3 = "";
  f.rules.power.equipmentSets!.get("s")!.suit_num3 = "bad";
  expect(f.resolve().get(78)).toBe(18);
});

test("suit accumulation follows a fresh String HashMap and retains strict whole-separator effect parsing", () => {
  const f = fixture();
  f.equipment.length = 0;
  f.modifiers.clear();
  for (const [index, suit] of ["c", "b", "a"].entries()) {
    f.rules.power.equipment!.set(String(index + 1), { suit_id: suit });
    f.equipment.push(
      { itemId: index + 1, extraProperty: null },
      { itemId: index + 1, extraProperty: null },
    );
    f.rules.power.equipmentSets!.set(suit, {
      suit_para1: "78",
      suit_num1: suit === "a" ? "10000000000" : suit === "b" ? "-10000000000" : "1",
    });
  }
  expect(f.resolve().get(78)).toBe(1);
  f.rules.power.equipmentSets!.get("c")!.suit_para1 = "|78||78";
  expect(f.resolve().get(78)).toBe(2);
  for (const raw of ["78|", " "]) {
    f.rules.power.equipmentSets!.get("c")!.suit_para1 = raw;
    expect(() => f.resolve()).toThrow();
  }
  f.rules.power.equipmentSets!.get("c")!.suit_para1 = "";
  expect(f.resolve().get(78)).toBe(0);
});

test("missing optional color/site skips their pair, but invalid consumed enums and nonnumeric modifier results reject", () => {
  const f = fixture();
  f.rules.power.equipment!.get("1")!.color = "";
  f.rules.power.equipment!.get("1")!.site = "bad";
  expect(f.resolve().get(78)).toBe(7.5);
  for (const [color, site] of [
    ["-1", "0"],
    ["6", "0"],
    ["2", "7"],
    ["2", "-1"],
    [" ", "0"],
  ]) {
    Object.assign(f.rules.power.equipment!.get("1")!, { color, site });
    expect(() => f.resolve()).toThrow();
  }
  f.rules.power.equipment!.set("1", { para1: "78", num1: "2" });
  expect(() =>
    newGeneralEquipmentEffects(7, f.equipment, f.rules, () => undefined as unknown as number),
  ).toThrow();
  expect(() =>
    newGeneralEquipmentEffects(7, Array(4097).fill(f.equipment[0]), f.rules, f.owner),
  ).toThrow();
  f.rules.power.equipment!.clear();
  expect(f.resolve().get(78)).toBe(4.5);
});

test("concrete equipment calculation connects to building composition and preserves the outer failure boundary", () => {
  const f = fixture();
  const general: NewGeneralEquippedState = {
    id: 7,
    state: 2,
    buildingUuid: "castle",
    star: 1,
    baseSkill: null,
    talent: null,
    opTime: null,
    refinement: null,
    statuses: [],
    orderedEquipment: f.equipment,
  };
  const building: NewGeneralBuildingState = {
    buildingUuid: "castle",
    buildingUuids: new Set(["castle"]),
    mainBuildingLevel: 1,
    playerLevel: 1,
    prestigeLevel: 0,
    offices: [],
  };
  const context = { now: 1000, version: "12.6.0", kingdomId: 1 };
  const resolve = () =>
    equippedGeneralBuildingEffect(
      () => ({ orderedGenerals: [general], building }),
      f.rules,
      context,
      78,
      f.owner,
      () => 1000n,
    );
  expect(resolve()).toBe(9.75);
  f.equipment[0]!.extraProperty = "78,bad";
  expect(resolve()).toBe(0);
  general.state = 1;
  f.calls.length = 0;
  expect(resolve()).toBe(0);
  expect(f.calls).toEqual([]);
});
