import { expect, test } from "bun:test";
import { javaListSort } from "@opencok/rules/java-list-sort";
import { restoredKingdomSkills } from "@opencok/rules/kingdom-skills";
import { Rules, type Rule } from "@opencok/rules/game";
import { dataConfig } from "@opencok/mappings/bootstrap";
import { decode, encode, fields } from "@opencok/messages/sfs";
import { dataConfigItems } from "./fixtures/data-config.ts";
import { kingdomSkill } from "./fixtures/kingdom-skill.ts";
import vectors from "./fixtures/kingdom-skill-sort-vectors.json";

function rows(seed: number, length: number, mode: number) {
  let state = seed;
  const next = () => (state = (Math.imul(state, 1664525) + 1013904223) >>> 0);
  const bounds = [-2147483648, 2147483647, -2147483647, 2147483646, -2, -1, 0, 1, 2, 100];
  return Array.from({ length }, (_, position) => {
    const identity = next();
    const id =
      mode === 0 || mode === 2 || mode === 4 ? position : identity % 5 === 0 ? null : identity % 13;
    const value = next();
    const tabIndex =
      mode === 0
        ? value | 0
        : mode === 1
          ? bounds[value % bounds.length]!
          : mode === 2 || mode === 3
            ? (value % 101) - 50
            : (position % 64) * 10 + (value % 7);
    return { id, tabIndex, position };
  });
}
function project(records: Rule[]) {
  const rules = new Rules(
    new Map(),
    new Map(),
    new Map(),
    new Map(),
    dataConfigItems(),
    new Map(),
    new Map(),
    new Map(),
    2,
  );
  rules.items.set("kingdomskill", { k9: "keep", k3: "old" });
  rules.configuration.kingdomSkills = new Map([
    ["indexed-only", kingdomSkill({ id: "indexed-only" })],
  ]);
  rules.configuration.kingdomSkillRecords = records;
  return fields(decode(encode(dataConfig(rules, { now: 1000 }))).dataConfig).kingdomskill;
}

test("bounded Java list sorting matches 360 JDK cases including 36 comparator failures without mutating inputs", () => {
  expect(vectors).toHaveLength(360);
  expect(vectors.filter((vector) => vector.order === null)).toHaveLength(36);
  for (const vector of vectors) {
    const input = rows(vector.seed, vector.length, vector.mode);
    const before = structuredClone(input);
    let comparisons = 0;
    let trace = 0;
    const compare = (a: (typeof input)[number], b: (typeof input)[number]) => {
      comparisons++;
      trace = (Math.imul((Math.imul(trace, 31) + a.position) | 0, 31) + b.position) | 0;
      return a.id === b.id ? 0 : (a.tabIndex - b.tabIndex) | 0;
    };
    if (vector.order === null)
      expect(() => javaListSort(input, compare)).toThrow("comparison contract");
    else
      expect(
        javaListSort(input, compare).map((entry) => entry.position),
        JSON.stringify([vector.seed, vector.length, vector.mode]),
      ).toEqual(vector.order);
    expect(input).toEqual(before);
    expect(comparisons).toBe(vector.comparisons);
    expect(trace).toBe(vector.trace);
  }
});

test("Java list sorting bounds work, skips unused comparisons and preserves equality and wrapped ordering", () => {
  const unused = () => {
    throw new Error("Unused comparator");
  };
  expect(javaListSort([], unused)).toEqual([]);
  expect(javaListSort([1], unused)).toEqual([1]);
  expect(() => javaListSort(Array(4097).fill(1), unused)).toThrow("Too many");
  expect(javaListSort([-2147483648, 2147483647], (a, b) => (a - b) | 0)).toEqual([
    2147483647, -2147483648,
  ]);
  const input = [
    { id: 1, value: 2 },
    { id: 1, value: 1 },
  ];
  expect(javaListSort(input, (a, b) => (a.id === b.id ? 0 : a.value - b.value))).toEqual(input);
});

test("kingdom skill restoration validates all constructor numeric fields and skips whole malformed records", () => {
  const valid = kingdomSkill({ id: "valid", online: "2" });
  for (const field of [
    "skillCategory",
    "effectType",
    "cd",
    "effectTime",
    "releaseTimes",
    "useType",
    "costMaterial",
    "sucRatio",
    "showTab",
    "tabIndex",
    "value",
  ]) {
    const missing = kingdomSkill({ id: "missing" });
    delete missing[field];
    const malformed = kingdomSkill({ id: "bad", [field]: "invalid" });
    expect(
      restoredKingdomSkills([missing, valid, malformed]).map((skill) => skill.id),
      field,
    ).toEqual(["valid"]);
  }
  for (const skillCategory of ["-1", "5", "2147483648"])
    expect(restoredKingdomSkills([kingdomSkill({ skillCategory })])).toEqual([]);
  for (const skillCategory of ["0", "4", "+２"])
    expect(restoredKingdomSkills([kingdomSkill({ skillCategory })])).toHaveLength(1);
  for (const effectType of ["-2147483648", "2147483647"])
    expect(
      restoredKingdomSkills([kingdomSkill({ effectType, cd: "-1", value: "-2147483648" })]),
    ).toHaveLength(1);
  const before = structuredClone(valid);
  expect(restoredKingdomSkills([valid])[0]).toEqual({
    id: "valid",
    showTab: 3,
    tabIndex: 0,
    online: "2",
    test: undefined,
  });
  expect(valid).toEqual(before);
  expect(() => restoredKingdomSkills(Array(4097).fill(valid))).toThrow("Too many");
});

test("kingdom skill costs use Java trailing-empty removal and Float constructor validation accepts nonfinite values", () => {
  for (const costMaterial of ["0", "1;", "1;;", ";", ";;", "+２;-3;"])
    expect(restoredKingdomSkills([kingdomSkill({ costMaterial })]), costMaterial).toHaveLength(1);
  for (const costMaterial of [
    "",
    ";1",
    "1;;2",
    "bad;",
    "2147483648;",
    "1; ",
    "1".repeat(65536),
    Array(4097).fill("1").join(";"),
  ])
    expect(
      restoredKingdomSkills([kingdomSkill({ costMaterial })]),
      costMaterial.slice(0, 30),
    ).toEqual([]);
  for (const sucRatio of ["NaN", "-Infinity", "0x1.2p3f", " 1 ", "1e1000"])
    expect(restoredKingdomSkills([kingdomSkill({ sucRatio })])).toHaveLength(1);
  for (const sucRatio of ["∞", "1,5", "0x1", ""])
    expect(restoredKingdomSkills([kingdomSkill({ sucRatio })])).toEqual([]);
  expect(
    restoredKingdomSkills([
      kingdomSkill({
        needToRelease: "unused",
        privilige: "unused",
        effectValue: "not-parsed-here",
      }),
    ]),
  ).toHaveLength(1);
});

test("kingdom skill projection keeps ordered duplicate IDs, null labels and separators before hidden trailing entries", () => {
  const missingId = kingdomSkill({ tabIndex: "5" });
  delete missingId.id;
  const records = [
    kingdomSkill({ id: "same", tabIndex: "2", online: "2" }),
    kingdomSkill({ id: "same", tabIndex: "1", online: "close" }),
    missingId,
    kingdomSkill({ id: "", tabIndex: "6", online: "2" }),
    kingdomSkill({ id: "visible", showTab: "4", tabIndex: "-2", online: "2" }),
    kingdomSkill({ id: "hidden", showTab: "4", tabIndex: "-1", online: "bad" }),
    kingdomSkill({ id: "only-hidden", showTab: "5", tabIndex: "-1", online: "bad" }),
    kingdomSkill({ id: "bad", skillCategory: "5", showTab: "6", online: "bad" }),
  ];
  const before = structuredClone(records);
  const result = fields(project(records));
  expect(result.k3?.value).toBe("same_1;same_0;null_0;_1");
  expect(result.k4?.value).toBe("visible_1;");
  expect(result.k5?.value).toBe("");
  expect(result.k6).toBeUndefined();
  expect(result.k9?.value).toBe("keep");
  expect(records).toEqual(before);
});

test("kingdom skill wire tabs follow fresh Integer HashMap order and reject reached selector failures", () => {
  const records = [17, 1, 16].map((showTab) =>
    kingdomSkill({ id: String(showTab), showTab: String(showTab), online: "2" }),
  );
  expect(Object.keys(fields(project(records)))).toEqual(["k9", "k3", "k16", "k17", "k1"]);
  const bad = kingdomSkill({ online: "bad;2" });
  expect(() => project([bad])).toThrow();
  bad.cd = "malformed";
  expect(fields(project([bad])).k3?.value).toBe("old");
});

test("kingdom skill wire composition uses wrapped Java ordering and preserves comparator failures", () => {
  for (const vector of vectors
    .filter((value) => value.length >= 32 && value.length <= 65)
    .slice(0, 40)) {
    const input = rows(vector.seed, vector.length, vector.mode);
    const records = input.map((entry) => {
      const record = kingdomSkill({ tabIndex: String(entry.tabIndex), online: "2" });
      if (entry.id === null) delete record.id;
      else record.id = String(entry.id);
      return record;
    });
    if (vector.order === null) expect(() => project(records)).toThrow("comparison contract");
    else {
      const result = vector.order
        .map((position, index) => {
          const entry = input[position]!;
          return entry.tabIndex === -1
            ? ""
            : `${entry.id}_1${index === input.length - 1 ? "" : ";"}`;
        })
        .join("");
      expect(fields(project(records)).k3?.value).toBe(result);
    }
  }
});
