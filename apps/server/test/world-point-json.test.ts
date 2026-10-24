import { expect, test } from "bun:test";
import { roundTripLegacyIntegerObject } from "@opencok/messages/legacy-json";
import { sfs, Type, encode, decode, type Fields } from "@opencok/messages/sfs";
import vectors from "./fixtures/world-point-json-vectors.json";

test("remote integer JSON conversion matches independent Java 8 signed decimal parsing vectors", () => {
  expect(vectors.numbers.length).toBeGreaterThan(500);
  for (const [value, type] of vectors.numbers) {
    const fields = { power: sfs.long(value!), point: sfs.int(701) };
    const before = structuredClone(fields);
    const result = roundTripLegacyIntegerObject(fields);
    expect(result.power).toEqual(type === "Int" ? sfs.int(Number(value)) : sfs.long(value!));
    expect(decode(encode(result))).toEqual(result);
    expect(fields).toEqual(before);
  }
});

test("remote string serialization matches Java 8 function detection without executing function-like values", () => {
  expect(vectors.functions).toHaveLength(48);
  for (const [value, recognized] of vectors.functions) {
    const input = { pic: sfs.string(value as string) };
    if (recognized) expect(() => roundTripLegacyIntegerObject(input)).toThrow();
    else expect(roundTripLegacyIntegerObject(input)).toEqual(input);
  }
});

test("remote public JSON conversion retains quoted strings and legacy excluded property behavior", () => {
  const fields = Object.create(null) as Fields;
  for (const [key, value] of Object.entries({
    uid: "null",
    pic: "{a:1}",
    afn: "[true]",
    quote: '"null"',
    slashes: "a\\b",
    controls: "a\t\nb",
    unicode: "á😀",
    numeric: "00123",
    ["__proto__"]: "safe",
    constructor: "value",
  }))
    fields[key] = sfs.string(value);
  const result = roundTripLegacyIntegerObject(fields);
  expect(result).toEqual(fields);
  expect(decode(encode(result))).toEqual(result);
  expect(
    roundTripLegacyIntegerObject({
      class: sfs.string("function(){}"),
      declaringClass: sfs.int(1),
      metaClass: sfs.long(2n),
      point: sfs.int(3),
    }),
  ).toEqual({ point: sfs.int(3) });
  expect(() => roundTripLegacyIntegerObject({ null: sfs.string("value") })).toThrow();
});

test("remote integer object conversion rejects unsupported scalar types, invalid widths and oversized JSON", () => {
  for (const value of [
    sfs.int(2147483648),
    sfs.int(1.5),
    sfs.int(Infinity),
    sfs.long(9223372036854775808n),
    sfs.double(1),
    { type: Type.Float, value: 1 },
    sfs.object({}),
    sfs.array(),
    sfs.bool(true),
    { type: Type.String, value: 1 },
  ])
    expect(() => roundTripLegacyIntegerObject({ field: value })).toThrow();
  expect(() =>
    roundTripLegacyIntegerObject({ pic: sfs.string("a".repeat(4 * 1024 * 1024)) }),
  ).toThrow();
  const huge = Object.fromEntries(Array.from({ length: 32768 }, (_, i) => [String(i), sfs.int(i)]));
  expect(() => roundTripLegacyIntegerObject(huge)).toThrow();
});
