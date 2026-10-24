import { expect, test } from "bun:test";
import { Rules } from "@opencok/rules/game";
import {
  newGeneralStatusEffect,
  newGeneralRefinementEffect,
} from "@opencok/rules/new-general-status";
import { newGeneralSkillEffects } from "@opencok/rules/new-general-skills";
import { javaFloat } from "@opencok/rules/java-float";
import vectors from "./fixtures/new-general-skill-vectors.json";

const context = { kingdomId: 1, version: "12.6.0", now: Date.UTC(2026, 9, 24, 12) };
function fixture() {
  const rules = new Rules(new Map(), new Map(), new Map());
  rules.features.set("general_random_effect", {
    version: "12.6.0",
    online: "1",
    test: "2",
    start: "2026-10-24-12-00",
    end: "2026-10-24-13-00",
  });
  rules.power.statuses = new Map([["1", { effect: "78;2.5|91;4" }]]);
  rules.power.newGeneralRefinement = new Map([
    ["a", { effect: "78;78;91" }],
    ["b", { effect: "91" }],
  ]);
  return rules;
}

test("general status boundaries are inclusive exact Long comparisons with nullable primitive defaults", () => {
  const rules = fixture();
  const status = { stateId: 1, startTime: 9007199254740993n, endTime: 9007199254740994n };
  for (const [now, value] of [
    [status.startTime - 1n, 0],
    [status.startTime, 2.5],
    [status.endTime, 2.5],
    [status.endTime + 1n, 0],
  ] as const)
    expect(newGeneralStatusEffect([status], rules, 78, now)).toBe(value);
  expect(
    newGeneralStatusEffect([{ stateId: 1, startTime: null, endTime: null }], rules, 78, 0n),
  ).toBe(2.5);
  expect(
    newGeneralStatusEffect([{ stateId: 1, startTime: -5n, endTime: -1n }], rules, 78, -1n),
  ).toBe(2.5);
  expect(newGeneralStatusEffect([{ stateId: 1, startTime: 2n, endTime: 1n }], rules, 78, 1n)).toBe(
    0,
  );
});

test("restored statuses keep final duplicate IDs and final duplicate configured effects without mutating inputs", () => {
  const rules = fixture();
  rules.power.statuses!.get("1")!.effect = "78;1|78;7|ignored|91;2;3";
  const statuses = [
    { stateId: 1, startTime: 0n, endTime: 100n },
    { stateId: 1, startTime: 50n, endTime: 100n },
  ];
  const before = structuredClone(statuses);
  expect(newGeneralStatusEffect(statuses, rules, 78, 49n)).toBe(0);
  expect(newGeneralStatusEffect(statuses, rules, 78, 50n)).toBe(7);
  expect(statuses).toEqual(before);
});

test("status failures propagate while expired statuses skip catalog parsing and missing status definitions supply no effects", () => {
  const rules = fixture();
  const status = { stateId: 1, startTime: 0n, endTime: 1n };
  rules.power.statuses!.get("1")!.effect = "91;bad";
  expect(() => newGeneralStatusEffect([status], rules, 78, 1n)).toThrow();
  expect(newGeneralStatusEffect([status], rules, 78, 2n)).toBe(0);
  rules.power.statuses!.clear();
  expect(newGeneralStatusEffect([status], rules, 78, 1n)).toBe(0);
  expect(() => newGeneralStatusEffect([status], rules, 78, 9223372036854775808n)).toThrow();
  expect(() =>
    newGeneralStatusEffect([status], rules, 78, undefined as unknown as bigint),
  ).toThrow();
  expect(() => newGeneralStatusEffect(Array(4097).fill(status), rules, 78, 0n)).toThrow();
});

test("status accumulation follows independent Java 8 map orders and Float parsing fixtures", () => {
  for (const [index, vector] of vectors.orders.entries()) {
    const rules = fixture();
    const ids = [...new Set(vector.input)];
    const values = new Map(
      ids.map((id, i) => [id, i % 3 === 0 ? "10000000000" : i % 3 === 1 ? "-10000000000" : "0.1"]),
    );
    rules.power.statuses = new Map(
      ids.map((id) => [String(id), { effect: `78;${values.get(id)}` }]),
    );
    const statuses = ids.map((stateId) => ({ stateId, startTime: 0n, endTime: 10n }));
    let expected = 0;
    for (const id of vector.first) expected = Math.fround(expected + javaFloat(values.get(id)));
    expect(newGeneralStatusEffect(statuses, rules, 78, 5n)).toBe(expected);
    const raw = vectors.floats[index]![0] as string;
    rules.power.statuses!.set("1", { effect: `78;${raw}` });
    expect(
      newGeneralStatusEffect([{ stateId: 1, startTime: 0n, endTime: 10n }], rules, 78, 5n),
    ).toBe(Math.fround(0 + javaFloat(raw)));
  }
});

test("refinement obeys owner version and inclusive server feature gates before reading malformed stored content", () => {
  const rules = fixture();
  const resolve = (patch: Partial<typeof context> & { testServer?: boolean } = {}) =>
    newGeneralRefinementEffect("1;a_2", rules, { ...context, ...patch }, 78);
  expect(resolve()).toBe(2);
  expect(resolve({ now: context.now + 3600000 })).toBe(2);
  for (const patch of [
    { version: "12.5.99" },
    { kingdomId: 2 },
    { now: context.now - 1 },
    { now: context.now + 3600001 },
  ])
    expect(resolve(patch)).toBe(0);
  expect(resolve({ kingdomId: 2, testServer: true })).toBe(2);
  rules.features.clear();
  expect(newGeneralRefinementEffect("x".repeat(301), rules, context, 78)).toBe(0);
});

test("refinement keeps final duplicate slots, ignores extra semicolon fields and blank underscore members, and counts each effect once", () => {
  const rules = fixture();
  expect(
    newGeneralRefinementEffect(
      "|ignored|1;a_99|１;;__a_ _2__extra;ignored|2;b_5|",
      rules,
      context,
      78,
    ),
  ).toBe(2);
  expect(
    newGeneralRefinementEffect("32;a_10000000000|1;a_-10000000000|0;a_1", rules, context, 78),
  ).toBe(0);
  expect(newGeneralRefinementEffect(null, rules, context, 78)).toBe(0);
  expect(newGeneralRefinementEffect(" \u2000 ", rules, context, 78)).toBe(0);
  expect(newGeneralRefinementEffect("1;a_2|1;a_5", rules, context, 78)).toBe(5);
});

test("refinement failure discards its whole partial sum while preserving other general components", () => {
  const rules = fixture();
  rules.power.newGeneralBases = new Map([["1", { base_skill: "10" }]]);
  rules.power.newGeneralSkills = new Map([["10", { type: "0", para1: "78", base: "4" }]]);
  const skills = newGeneralSkillEffects({ id: 1, star: 1, baseSkill: null, talent: "10;1" }, rules);
  const subtotal = Math.fround(
    Math.fround(
      newGeneralStatusEffect([{ stateId: 1, startTime: 0n, endTime: 10n }], rules, 78, 5n) +
        skills.skills.get(78)!,
    ) + skills.talents.get(78)!,
  );
  for (const raw of [
    "0;a_100|1;missing_2",
    "0;a_100|1;a_bad",
    "0;a_100|1;a",
    "0;a_100|bad;a_2",
    "0;a_100|1;",
    "x".repeat(301),
  ]) {
    const refinement = newGeneralRefinementEffect(raw, rules, context, 78);
    expect(refinement).toBe(0);
    expect(Math.fround(subtotal + refinement)).toBe(10.5);
  }
  rules.power.newGeneralRefinement!.get("b")!.effect = "91;bad";
  expect(newGeneralRefinementEffect("0;a_100|1;b_2", rules, context, 78)).toBe(0);
  rules.power.newGeneralRefinement!.get("b")!.effect = "91";
  expect(newGeneralRefinementEffect("0;a_100|1;b_NaN", rules, context, 78)).toBe(100);
  expect(newGeneralRefinementEffect("1;a_NaN", rules, context, 78)).toBeNaN();
});
