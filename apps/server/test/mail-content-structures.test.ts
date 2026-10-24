import { expect, test } from "bun:test";
import { decodeLegacyJsonObject, LegacyJsonError } from "@opencok/messages/legacy-json";
import {
  decode,
  encode,
  fields,
  ProtocolError,
  sfs,
  Type,
  type Fields,
  type Value,
} from "@opencok/messages/sfs";
import { mailContentsProjection } from "@opencok/services/mail-contents";
import vectors from "./fixtures/mail-structure-vectors.json";

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
    case Type.Object: {
      const object = value.value as Fields;
      return `O[${Object.keys(object)
        .map((key) => [Buffer.from(key).toString("base64"), describe(object[key]!)] as const)
        .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0))
        .map(([key, item]) => `${key}=${item}`)
        .join(",")}]`;
    }
    default:
      throw new Error("Unexpected wire value");
  }
}

test("stored structures match 144 frozen legacy oracle vectors without executing function values", () => {
  expect(vectors).toHaveLength(144);
  for (const [input, expected] of vectors) {
    if (expected === "Error") {
      expect(() => decodeLegacyJsonObject(input!)).toThrow(LegacyJsonError);
      continue;
    }
    const result = decodeLegacyJsonObject(input!);
    expect(describe(sfs.object(result))).toBe(expected!);
    expect(describe(sfs.object(decode(encode(result))))).toBe(expected!);
  }
});

test("array holes and functions only invalidate values retained after legacy exclusions", () => {
  expect(
    decodeLegacyJsonObject(
      '{class:[1,,2],declaringClass:[function(){}],metaClass:"function(){}",kept:1}',
    ),
  ).toEqual({ kept: sfs.int(1) });
  for (const input of [
    "{kept:[,]}",
    "{kept:[function(){}]}",
    "{class:function(){}}",
    '{kept: "function(){}"}',
  ])
    expect(() => decodeLegacyJsonObject(input)).toThrow(LegacyJsonError);
  expect(decodeLegacyJsonObject('{kept:"function(){}"}')).toEqual({
    kept: sfs.string('"function(){}"'),
  });
  expect(decodeLegacyJsonObject('{kept:["{}","null","[1]"]}')).toEqual({
    kept: sfs.array([sfs.string('"{}"'), sfs.string('"null"'), sfs.string('"[1]"')]),
  });
  expect(decodeLegacyJsonObject('{kept:"{}",kept:"{}"}')).toEqual({
    kept: sfs.array([sfs.object({}), sfs.string('"{}"')]),
  });
});

test("escaped UTF-16 units use Java UTF-8 replacement while valid pairs and hexadecimal escapes survive", () => {
  expect(
    decodeLegacyJsonObject(
      '{a:"\\uD800x\\uDC00",b:"\\uD83D\\uDE00",c:"\\u٠٠٤١",d:"\\x-1",e:"\\u-001"}',
    ),
  ).toEqual({
    a: sfs.string("?x?"),
    b: sfs.string("😀"),
    c: sfs.string("A"),
    d: sfs.string("\uffff"),
    e: sfs.string("\uffff"),
  });
  expect(decodeLegacyJsonObject('{"\\uD800":1}')).toEqual({ "?": sfs.int(1) });
  expect(() => decodeLegacyJsonObject('{"\\uD800":1,"\\uDC00":2}')).toThrow(ProtocolError);
  expect(() => decodeLegacyJsonObject('{a:"\\uGGGG"}')).toThrow(LegacyJsonError);
});

test("mail projection removes retained unrepresentable structures but keeps excluded content and encoded surrogate replacements", () => {
  const records = [
    { uid: "hole", type: 5, createTime: 1n, contents: Buffer.from("{body:[,]}"), extra: null },
    {
      uid: "function",
      type: 5,
      createTime: 1n,
      contents: Buffer.from("{body:function(){}}"),
      extra: null,
    },
    {
      uid: "kept",
      type: 5,
      createTime: 1n,
      contents: Buffer.from('{class:[,],body:"\\uD800"}'),
      extra: null,
    },
  ];
  const projection = mailContentsProjection(records);
  expect(projection.invalidIds).toEqual(["hole", "function"]);
  const objects = projection.body.result!.value as Value[];
  expect(objects).toHaveLength(1);
  expect(fields(objects[0]).body).toEqual(sfs.string("?"));
  expect(fields(objects[0]).contentsArr).toEqual(
    sfs.array([sfs.string(records[2]!.contents.toString())]),
  );
  expect(decode(encode(projection.body))).toEqual(projection.body);
});
