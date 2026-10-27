import { expect, test } from "bun:test";
import { javaCalendarDate } from "@opencok/rules/java-calendar-date";
import { ruleAvailable, ruleTime } from "@opencok/rules/availability";
import { serverFeature } from "@opencok/rules/power-context";
import { Rules } from "@opencok/rules/game";
import vectors from "./fixtures/calendar-date-vectors.json";

const context = { kingdomId: 2, version: "12.6.0", now: Date.UTC(2026, 2, 1) };

test("calendar parsing matches 2971 independent Java 8 numeric, rollover, cutover and offset cases", () => {
  expect(vectors.single).toHaveLength(2971);
  for (const [value, fields, offset, expected] of vectors.single as [
    string,
    3 | 5,
    number,
    string,
  ][]) {
    expect(javaCalendarDate(value, fields, offset)?.toString() ?? "error", value).toBe(expected);
    if (fields === 5)
      {expect(ruleTime(value, offset)).toBe(expected === "error" ? 0n : BigInt(expected));}
  }
});

test("reused date formatters preserve the previous calendar in 108 independently generated cutover pairs", () => {
  expect(vectors.pairs).toHaveLength(108);
  for (const [first, second, offset, expectedFirst, expectedSecond] of vectors.pairs as [
    string,
    string,
    number,
    string,
    string,
  ][]) {
    const start = javaCalendarDate(first, 5, offset);
    expect(start).toBe(BigInt(expectedFirst));
    expect(javaCalendarDate(second, 5, offset, start)).toBe(BigInt(expectedSecond));
  }
  const second = "1582--138983-4230550-0-0";
  expect(javaCalendarDate(second)).toBe(-12217305600000n);
  expect(javaCalendarDate(second, 5, 0, javaCalendarDate("1000-1-1-0-0"))).toBe(-12223958400000n);
});

test("calendar parsing consumes a prefix with the requested fields and retains signed Long results", () => {
  expect(javaCalendarDate("2026-2-29ignored", 3)).toBe(BigInt(context.now));
  expect(javaCalendarDate("2026-2-29ignored", 5)).toBeUndefined();
  expect(javaCalendarDate("2026-3-1-12-00", 3)).toBe(BigInt(context.now));
  expect(javaCalendarDate(" ２０２６-\t３-１-0-0suffix")).toBe(BigInt(context.now));
  expect(javaCalendarDate("2026-3-1-0-1E2")).toBe(BigInt(context.now + 6000000));
  expect(javaCalendarDate("2026-3-1-0-1.5")).toBe(BigInt(context.now + 60000));
  expect(javaCalendarDate("2026-3-1-0-�")).toBe(BigInt(context.now));
  expect(javaCalendarDate("2147483648-1-1-0-0")).toBe(6017484157321406464n);
  expect(javaCalendarDate("9223372036854775808-1-1-0-0")).toBe(-6019000092841406464n);
  for (const value of ["", "bad", "2026-3-1", "+2026-3-1-0-0", "\n2026-3-1-0-0"])
    {expect(ruleTime(value)).toBe(0n);}
});

test("calendar bounds reject unsupported inputs without mistaking parse failure for an out-of-range JS date", () => {
  const value = "2026-3-1-0-0";
  expect(javaCalendarDate(value.padEnd(65535, "x"))).toBe(BigInt(context.now));
  expect(() => javaCalendarDate(value.padEnd(65536, "x"))).toThrow();
  for (const offset of [-841, 841, 0.5, NaN, Infinity])
    {expect(() => javaCalendarDate(value, 5, offset)).toThrow();}
  for (const input of [null, undefined, 0, {}])
    {expect(() => javaCalendarDate(input as string)).toThrow();}
  expect(() => javaCalendarDate(value, 5, 0, 9223372036854775808n)).toThrow();
});

test("function-on and server-only windows normalize dates and retain sequential zero-fallback checks", () => {
  const rules = new Rules(new Map(), new Map(), new Map());
  const rule = {
    version: "12.6.0",
    online: "2",
    start: "2026-2-29-0-0suffix",
    end: "2026-3-1-0-0",
  };
  rules.features.set("synthetic", rule);
  const queries = [
    (now: number) => ruleAvailable(rule, { ...context, now }),
    (now: number) => serverFeature(rules, "synthetic", { ...context, now }),
  ];
  for (const query of queries) {
    expect(query(context.now)).toBe(true);
    expect(query(context.now - 1)).toBe(false);
    expect(query(context.now + 1)).toBe(false);
  }
  rule.start = "bad";
  for (const query of queries) {expect(query(context.now)).toBe(true);}
  rule.end = "bad";
  for (const query of queries) {
    expect(query(context.now)).toBe(false);
    expect(query(0)).toBe(true);
    expect(query(-1)).toBe(false);
  }
  rule.start = "2147483648-1-1-0-0";
  Object.defineProperty(rule, "end", {
    get: () => {
      throw new Error("Unused end date");
    },
  });
  for (const query of queries) {expect(query(context.now)).toBe(false);}
  rule.start = "9223372036854775808-1-1-0-0";
  for (const query of queries) {expect(() => query(context.now)).toThrow("Unused end date");}
});
