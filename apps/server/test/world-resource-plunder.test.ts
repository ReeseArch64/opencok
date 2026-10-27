import { expect, test } from "bun:test";
import { decodeLegacyJsonArray } from "@opencok/messages/legacy-json";
import { restoredResourcePlunder } from "@opencok/services/world-resource-detail";
import {
  resourceArmyLoad,
  resourceOwnerDetail,
  resourceSavedCollection,
} from "@opencok/rules/world-resource-detail";
import { worldResourceOwner } from "@opencok/mappings/world-resource-detail";
import { Rules } from "@opencok/rules/game";
import {
  decode,
  decodeArray,
  encode,
  encodeArray,
  sfs,
  Type,
  type Value,
  type Fields,
} from "@opencok/messages/sfs";
import numbers from "./fixtures/mail-number-vectors.json";
import structures from "./fixtures/mail-structure-vectors.json";

function describe(value: Value): string {
  switch (value.type) {
    case Type.Null:
      return "N";
    case Type.String:
      return `S:${Buffer.from(value.value as string).toString("base64")}`;
    case Type.Bool:
      return `B:${value.value}`;
    case Type.Int:
      return `I:${value.value}`;
    case Type.Long:
      return `L:${value.value}`;
    case Type.Double: {
      const bytes = Buffer.alloc(8);
      bytes.writeDoubleBE(value.value as number);
      return `D:${bytes.readBigUInt64BE().toString(16)}`;
    }
    case Type.Array:
      return `A[${(value.value as Value[]).map(describe).join(",")}]`;
    case Type.Object:
      return `O[${Object.entries(value.value as Fields)
        .map(([key, item]) => [Buffer.from(key).toString("base64"), describe(item)])
        .sort(([left], [right]) => (left! < right! ? -1 : left! > right! ? 1 : 0))
        .map(([key, item]) => `${key}=${item}`)
        .join(",")}]`;
    default:
      throw new Error("Unexpected value type");
  }
}

test("root stored arrays preserve all 459 frozen numeric oracle outcomes and exact SFS widths", () => {
  expect(numbers).toHaveLength(459);
  for (const [raw, expected] of numbers) {
    if (expected === "Error") {
      expect(() => decodeLegacyJsonArray(`[${raw}]`)).toThrow();
      continue;
    }
    const array = decodeLegacyJsonArray(`[${raw}]`);
    const prefix = expected!.split(":")[0]!;
    const value = expected!.slice(prefix.length + 1);
    const tags: Record<string, string> = { Int: "I", Long: "L", Double: "D", String: "S" };
    const tag = tags[prefix];
    expect(array).toHaveLength(1);
    expect(describe(array[0]!)).toBe(
      `${tag}:${prefix === "String" ? Buffer.from(value).toString("base64") : value}`,
    );
    expect(describe(sfs.array(decodeArray(encodeArray(array))))).toBe(describe(sfs.array(array)));
  }
});

test("root arrays reuse 28 frozen structure outcomes including holes, functions and string quoting", () => {
  let count = 0;
  for (const [source, expected] of structures) {
    const match = /^\{a:(\[.*\])\}$/s.exec(source!);
    if (!match) {continue;}
    count++;
    if (expected === "Error") {expect(() => decodeLegacyJsonArray(match[1]!)).toThrow();}
    else
      {expect(describe(sfs.array(decodeLegacyJsonArray(match[1]!)))).toBe(
        expected!.slice("O[YQ===".length, -1),
      );}
  }
  expect(count).toBe(28);
});

test("root arrays retain permissive delimiters, comments, trailing text and nested exclusions", () => {
  expect(decodeLegacyJsonArray(" /*prefix*/ [ {v:010; class:1}, {v:0x10}, ] ignored")).toEqual([
    sfs.object({ v: sfs.int(8) }),
    sfs.object({ v: sfs.int(16) }),
  ]);
  expect(decodeLegacyJsonArray('["null","{}","[1]"]')).toEqual([
    sfs.string('"null"'),
    sfs.string('"{}"'),
    sfs.string('"[1]"'),
  ]);
  for (const source of ["null", "{}", "", "  ", "[", "[,]"])
    {expect(() => decodeLegacyJsonArray(source)).toThrow();}
});

test("plunder subtracts only one object with an Int value and preserves absent values", () => {
  expect(restoredResourcePlunder(null, 3)).toEqual([]);
  expect(restoredResourcePlunder("[]", 3)).toEqual([]);
  expect(restoredResourcePlunder("[{}]", 3)).toEqual([{}]);
  for (const [source, value] of [
    ["[{v:7}]", 7],
    ["[{v:-2147483648}]", -2147483648],
    ["[{v:2147483647}]", 2147483647],
    ["[{v:010}]", 8],
    ["[{v:0x10}]", 16],
    ["[{v:+7}]", 7],
  ] as const)
    {expect(restoredResourcePlunder(source, 3)).toEqual([{ value }]);}
  for (const source of [
    '[{v:"7"}]',
    "[{v:7.0}]",
    "[{v:2147483648}]",
    "[{v:null}]",
    "[{v:true}]",
    "[{v:7,v:8}]",
    "[1]",
    "[null]",
    "[[]]",
  ])
    {expect(() => restoredResourcePlunder(source, 3)).toThrow();}
});

test("multiple plunder entries and territory resource types skip value casts but still validate serialized arrays", () => {
  expect(restoredResourcePlunder("[1,null,{v:true}]", 3)).toEqual([{}, {}, {}]);
  for (const type of [18, 19]) {
    for (const source of ["[1]", "[null]", "[{v:2147483648}]", "[{v:7.0}]", '[{v:"seven"}]'])
      {expect(restoredResourcePlunder(source, type)).toEqual([{}]);}
    for (const source of ["null", "[function(){}]", "[1,,2]"])
      {expect(() => restoredResourcePlunder(source, type)).toThrow();}
  }
  expect(() => restoredResourcePlunder("[1,function(){}]", 3)).toThrow();
});

test("stored array and plunder bounds reject oversized input, excessive depth and invalid point types", () => {
  expect(() => decodeLegacyJsonArray("[" + " ".repeat(4 * 1024 * 1024) + "]")).toThrow();
  expect(() => decodeLegacyJsonArray("[" + Array(32768).fill("0").join(",") + "]")).toThrow();
  expect(() => decodeLegacyJsonArray("[".repeat(34) + "0" + "]".repeat(34))).toThrow();
  expect(() => restoredResourcePlunder("[" + " ".repeat(2047) + "]", 3)).toThrow();
  for (const pointType of [NaN, Infinity, 1.5, 2147483648])
    {expect(() => restoredResourcePlunder(null, pointType)).toThrow();}
});

test("collection restoration defaults nullable primitives and keeps exact Long fields and Float32 speed", () => {
  expect(resourceSavedCollection({})).toEqual({
    collectSpd: 0,
    marchArrivalTime: 0n,
    collectedBeforeSpd: 0,
    changeCollectSpdTime: 0n,
    occupyResourceEndTime: 0n,
  });
  expect(
    resourceSavedCollection({
      collectSpd: null,
      marchArrivalTime: null,
      collectedBeforeSpd: null,
      changeCollectSpdTime: null,
      occupyResourceEndTime: null,
    }),
  ).toEqual(resourceSavedCollection({}));
  const row = {
    collectSpd: 0.1,
    marchArrivalTime: 9007199254740993n,
    collectedBeforeSpd: -2147483648n,
    changeCollectSpdTime: -9223372036854775808n,
    occupyResourceEndTime: 9223372036854775807n,
  };
  const before = structuredClone(row);
  expect(resourceSavedCollection(row)).toEqual({
    ...row,
    collectSpd: Math.fround(0.1),
    collectedBeforeSpd: -2147483648,
  });
  expect(row).toEqual(before);
  for (const rate of [-0, NaN, Infinity, -Infinity])
    {expect(resourceSavedCollection({ collectSpd: rate }).collectSpd).toBe(rate);}
});

test("collection restoration rejects integer narrowing overflow and mistyped or out-of-range saved primitives", () => {
  for (const value of [-2147483649n, 2147483648n, 9223372036854775807n, 1, "1"])
    {expect(() => resourceSavedCollection({ collectedBeforeSpd: value })).toThrow("102192");}
  for (const value of [-2147483648n, 0n, 2147483647n])
    {expect(resourceSavedCollection({ collectedBeforeSpd: value }).collectedBeforeSpd).toBe(
      Number(value),
    );}
  for (const key of ["marchArrivalTime", "changeCollectSpdTime", "occupyResourceEndTime"])
    {for (const value of [1, "1", 9223372036854775808n, -9223372036854775809n])
      {expect(() => resourceSavedCollection({ [key]: value })).toThrow("102192");}}
  for (const value of ["1", 1n, Number.MAX_VALUE])
    {expect(() => resourceSavedCollection({ collectSpd: value })).toThrow("102192");}
});

test("plunder and saved collection fields compose with resource arithmetic and exact local wire types", () => {
  const rules = new Rules(new Map(), new Map(), new Map());
  rules.items.set("resources_weight", { k2: "3" });
  const armyLoad = resourceArmyLoad(
    {
      rawArmyLoad: 160,
      pointType: 3,
      pointItem: "1",
      plunder: restoredResourcePlunder('[{"v":7}]', 3),
    },
    rules,
  );
  const restored = resourceSavedCollection({
    collectSpd: 0.1,
    marchArrivalTime: 9007199254740993n,
    collectedBeforeSpd: 12n,
    changeCollectSpdTime: 3n,
    occupyResourceEndTime: 9223372036854775807n,
  });
  const result = worldResourceOwner(
    resourceOwnerDetail(3, 100, { ...restored, armyLoad, maxCollectTime: 0n }),
  );
  expect(result).toEqual({
    q: sfs.int(46),
    spd: { type: Type.Float, value: Math.fround(0.1) },
    sdt: sfs.long(9007199254740993n),
    tq: sfs.int(100),
    collected: sfs.int(12),
    changeCollectSpdTime: sfs.long(3n),
    occupyEndTime: sfs.long(9223372036854775807n),
  });
  expect(decode(encode(result))).toEqual(result);
});
