import { expect, test } from "bun:test";
import { Rules } from "@opencok/rules/game";
import { javaFloat } from "@opencok/rules/java-float";
import { javaIntHashMapOrder } from "@opencok/rules/java-hash-map-order";
import {
  newGeneralSkillEffects,
  type NewGeneralSkillState,
} from "@opencok/hero/rules/new-general-skills";
import vectors from "./fixtures/new-general-skill-vectors.json";

function bits(value: number) {
  if (Number.isNaN(value)) return 2143289344;
  const data = new DataView(new ArrayBuffer(4));
  data.setFloat32(0, value);
  return data.getInt32(0);
}

function fixture() {
  const rules = new Rules(new Map(), new Map(), new Map());
  rules.power.newGeneralBases = new Map([["1", { base_skill: "10" }]]);
  rules.power.newGeneralSkills = new Map([
    ["10", { type: "0", para1: "78", base: "2", add: "0.5" }],
    ["11", { type: "0", para1: "78", base: "3", add: "1" }],
  ]);
  const state: NewGeneralSkillState = { id: 1, star: 1, baseSkill: null, talent: null };
  return { rules, state, resolve: () => newGeneralSkillEffects(state, rules) };
}

test("direct Float parsing matches 1529 independent Java 8 decimal, hex and halfway vectors", () => {
  expect(vectors.floats).toHaveLength(1529);
  for (const vector of vectors.floats) {
    const [raw, expected] = vector as [string, number];
    expect(bits(javaFloat(raw))).toBe(expected);
  }
  const raw = "1.000000059604644775390625000001";
  expect(javaFloat(raw)).not.toBe(Math.fround(Number(raw)));
  expect(Object.is(javaFloat("-0"), -0)).toBe(true);
  expect(javaFloat(`0.${"0".repeat(65000)}1e65001`)).toBe(1);
  expect(javaFloat(`0x0.${"0".repeat(16000)}1p64004`)).toBe(1);
});

test("Float parsing rejects malformed, non-Java and oversized numeric text", () => {
  for (const raw of [
    null,
    undefined,
    1,
    "",
    " ",
    ".",
    "+",
    "1e",
    "0x1",
    "0x.p1",
    "1_0",
    "1ff",
    "NaNf",
    "infinity",
    "\u00a01",
    "1\u2000",
    "١",
    "1\n2",
    "0".repeat(65536),
  ])
    expect(() => javaFloat(raw)).toThrow();
});

test("integer HashMap traversal matches 80 Java 8 collision, tree split, resize and duplicate vectors", () => {
  expect(vectors.orders).toHaveLength(80);
  for (const vector of vectors.orders) {
    const first = javaIntHashMapOrder(vector.input);
    expect(first).toEqual(vector.first);
    expect(javaIntHashMapOrder(first)).toEqual(vector.second);
  }
  for (const value of [NaN, Infinity, 0.5, 2147483648, -2147483649])
    expect(() => javaIntHashMapOrder([value])).toThrow();
  expect(() => javaIntHashMapOrder(Array.from({ length: 4097 }, (_, i) => i))).toThrow();
});

test("passive skill and talent arithmetic matches 400 independent Java 8 Float and wrapped-level vectors", () => {
  expect(vectors.skills).toHaveLength(400);
  for (const vector of vectors.skills) {
    const f = fixture();
    f.rules.power.newGeneralSkills!.set("10", {
      type: "0",
      para1: "78;91;78;78;91",
      base: vector.base,
      add: vector.add,
    });
    f.state.baseSkill = `10;${vector.level}`;
    f.state.talent = f.state.baseSkill;
    const result = f.resolve();
    for (const [id, expected] of vector.expected) {
      expect(bits(result.skills.get(id!)!)).toBe(expected!);
      expect(bits(result.talents.get(id!)!)).toBe(expected!);
    }
  }
});

test("base skills retain star order and duplicates, default missing levels and never grow an empty base list", () => {
  const f = fixture();
  expect([...f.resolve().skills]).toEqual([[78, 2]]);
  f.state.star = 3;
  f.rules.power.newGeneralBases!.set("1", {
    base_skill: "10",
    base_skill_2: "11;10",
    base_skill_3: "11",
  });
  f.state.baseSkill = "10;3|11;2";
  expect([...f.resolve().skills]).toEqual([[78, 14]]);
  f.rules.power.newGeneralBases!.set("1", {
    base_skill: "",
    base_skill_2: "11",
    base_skill_3: "10",
  });
  expect(f.resolve().skills.size).toBe(0);
  f.rules.power.newGeneralBases!.clear();
  f.state.talent = "11;2";
  expect([...f.resolve().talents]).toEqual([[78, 4]]);
  f.state.star = 2147483647;
  f.rules.power.newGeneralBases!.set("1", {
    base_skill: "10",
    base_skill_2147483647: "11",
    base_skill_03: "invalid",
  });
  expect(f.resolve().skills.get(78)).toBe(7);
});

test("conditional skills skip base effects while talents still contribute, and active skills skip malformed effect data", () => {
  const f = fixture();
  f.rules.power.newGeneralSkills!.get("10")!.condition_type = "1";
  f.state.talent = "10;2";
  expect(f.resolve().skills.size).toBe(0);
  expect([...f.resolve().talents]).toEqual([[78, 2.5]]);
  f.rules.power.newGeneralSkills!.set("10", {
    type: "1",
    para1: "invalid",
    base: "invalid",
    add: "invalid",
  });
  expect(f.resolve().skills.size).toBe(0);
  expect(f.resolve().talents.size).toBe(0);
  f.rules.power.newGeneralSkills!.set("10", { type: "invalid", condition_type: "\u00a0" });
  f.state.talent = null;
  expect(f.resolve().skills.size).toBe(0);
  f.rules.power.newGeneralSkills!.get("10")!.condition_type = "\u2000";
  expect(() => f.resolve()).toThrow();
});

test("skill lists preserve separator behavior and zero-fill short numeric arrays without skipping invalid unused values", () => {
  const f = fixture();
  f.rules.power.newGeneralSkills!.set("10", {
    type: "0",
    para1: ";78;;91;78",
    base: "2",
    add: "1;3",
  });
  f.state.baseSkill = "10;3";
  expect([...f.resolve().skills]).toEqual([
    [91, 6],
    [78, 4],
  ]);
  f.rules.power.newGeneralSkills!.get("10")!.base = "2;3;4;invalid";
  expect(() => f.resolve()).toThrow();
  f.rules.power.newGeneralSkills!.get("10")!.base = "2;";
  expect(() => f.resolve()).toThrow();
  f.rules.power.newGeneralSkills!.set("10", { type: "0", para1: "78;bad", base: "2" });
  expect(() => f.resolve()).toThrow();
  f.rules.power.newGeneralSkills!.set("10", { type: "0" });
  expect(f.resolve().skills.size).toBe(0);
});

test("restored levels accept Java digits, keep final duplicates and skip malformed pairs without trimming integer tokens", () => {
  const f = fixture();
  f.state.baseSkill = "|ignored|10;9;1|10;2||１０;;３|";
  f.state.talent = "10;1|１０;３";
  expect([...f.resolve().skills]).toEqual([[78, 3]]);
  expect([...f.resolve().talents]).toEqual([[78, 3]]);
  for (const raw of ["10;", "10; 2", "10;2147483648", "bad;1", "10;2;"]) {
    f.state.talent = raw;
    if (raw === "10;2;") expect(f.resolve().talents.size).toBe(0);
    else expect(() => f.resolve()).toThrow();
  }
});

test("talents accumulate in restored Integer HashMap order instead of saved text order", () => {
  const f = fixture();
  f.rules.power.newGeneralSkills = new Map([
    ["32", { type: "0", para1: "78", base: "10000000000" }],
    ["1", { type: "0", para1: "78", base: "-10000000000" }],
    ["0", { type: "0", para1: "78", base: "1" }],
  ]);
  f.rules.power.newGeneralBases!.clear();
  f.state.talent = "32;1|1;1|0;1";
  expect(f.resolve().talents.get(78)).toBe(0);
  const before = structuredClone(f.state);
  f.resolve().talents.set(78, 123);
  expect(f.resolve().talents.get(78)).toBe(0);
  expect(f.state).toEqual(before);
});

test("missing required skill catalogs and bounded restored state reject without inventing a total general contribution", () => {
  const f = fixture();
  f.rules.power.newGeneralSkills!.delete("10");
  expect(() => f.resolve()).toThrow();
  f.rules.power.newGeneralBases!.clear();
  for (const patch of [
    { id: NaN },
    { star: 2147483648 },
    { star: 0.5 },
    { talent: " ".repeat(5001) },
    { baseSkill: " ".repeat(257) },
  ])
    expect(() => newGeneralSkillEffects({ ...f.state, ...patch }, f.rules)).toThrow();
  f.rules.power.newGeneralBases!.set("1", { base_skill: Array(4097).fill("10").join(";") });
  expect(() => f.resolve()).toThrow();
});
