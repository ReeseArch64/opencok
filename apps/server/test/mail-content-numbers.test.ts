import { expect, test } from "bun:test";
import { decodeLegacyJsonObject, LegacyJsonError } from "@opencok/messages/legacy-json";
import { decode, encode, fields, sfs, Type, type Value } from "@opencok/messages/sfs";
import { mailContentsProjection } from "@opencok/controllers/mail-contents";
import vectors from "./fixtures/mail-number-vectors.json";

function describe(value: Value): string {
  if (value.type === Type.Double) {
    const bytes = Buffer.alloc(8);
    bytes.writeDoubleBE(value.value as number);
    return `Double:${bytes.readBigUInt64BE().toString(16)}`;
  }
  const tag =
    value.type === Type.Int
      ? "Int"
      : value.type === Type.Long
        ? "Long"
        : value.type === Type.String
          ? "String"
          : "Unexpected";
  return `${tag}:${value.value}`;
}

test("stored numeric content matches 459 frozen Java 8 oracle vectors including exact binary64 rounding", () => {
  expect(vectors).toHaveLength(459);
  for (const [token, expected] of vectors) {
    if (expected === "Error") {
      expect(() => decodeLegacyJsonObject(`{value:${token}}`)).toThrow(LegacyJsonError);
      continue;
    }
    const object = decodeLegacyJsonObject(`{value:${token}}`);
    expect(describe(object.value!)).toBe(expected!);
    expect(describe(decode(encode(object)).value!)).toBe(expected!);
  }
});

test("legacy integer parsing accepts Java 8 BMP digits and fullwidth hex while respecting the ASCII initial-token gate", () => {
  for (const zero of [
    0x30, 0x660, 0x6f0, 0x7c0, 0x966, 0x9e6, 0xa66, 0xae6, 0xb66, 0xbe6, 0xc66, 0xce6, 0xd66, 0xe50,
    0xed0, 0xf20, 0x1040, 0x1090, 0x17e0, 0x1810, 0x1946, 0x19d0, 0x1a80, 0x1a90, 0x1b50, 0x1bb0,
    0x1c40, 0x1c50, 0xa620, 0xa8d0, 0xa900, 0xa9d0, 0xaa50, 0xabf0, 0xff10,
  ]) {
    const digits = String.fromCharCode(zero + 1, zero + 2, zero + 3);
    expect(decodeLegacyJsonObject(`{value:+${digits}}`).value).toEqual(sfs.int(123));
    expect(decodeLegacyJsonObject(`{value:-${digits}}`).value).toEqual(sfs.int(-123));
  }
  expect(decodeLegacyJsonObject("{value:0xＦｆ}").value).toEqual(sfs.int(255));
  expect(decodeLegacyJsonObject("{value:0x-８０００００００}").value).toEqual(sfs.int(-2147483648));
  for (const value of ["١٢٣", "１２３", "NaN"])
    expect(() => decodeLegacyJsonObject(`{value:${value}}`)).toThrow(LegacyJsonError);
  for (const value of ["+꧱", "+𝟙", "1²", "0xＧ", "0x-80000001"])
    expect(decodeLegacyJsonObject(`{value:${value}}`).value).toEqual(sfs.string(value));
});

test("numeric content preserves finite mail and only malformed overflow authorizes removal", () => {
  const data = [
    {
      uid: "valid",
      type: 5,
      createTime: 1n,
      contents: Buffer.from("{hex:0x1.00000000000008p0,unicode:1٠,negative:-0x1p-9999}"),
      extra: null,
    },
    {
      uid: "invalid",
      type: 5,
      createTime: 2n,
      contents: Buffer.from("{hex:0x1.fffffffffffff8p1023}"),
      extra: null,
    },
  ];
  const projected = mailContentsProjection(data);
  expect(projected.invalidIds).toEqual(["invalid"]);
  const objects = projected.body.result!.value as Value[];
  expect(objects).toHaveLength(1);
  const body = fields(objects[0]);
  expect(body.hex).toEqual(sfs.double(1));
  expect(body.unicode).toEqual(sfs.int(10));
  expect(Object.is(body.negative!.value, -0)).toBe(true);
  expect(body.contentsArr).toEqual(sfs.array([sfs.string(data[0]!.contents.toString())]));
});
