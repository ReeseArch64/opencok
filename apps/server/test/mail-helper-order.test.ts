import { expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { decodeLegacyJsonObject, legacyJsonEntries } from "@opencok/messages/legacy-json";
import { mailContentsProjection } from "@opencok/services/mail-contents";
import { decode, encode, fields, ProtocolError, sfs, type Value } from "@opencok/messages/sfs";
import vectors from "./fixtures/mail-helper-order-vectors.json";

const wireText = (value: string) =>
  value.replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, "?");
const objectText = (keys: string[]) =>
  `{${keys.map((key, index) => `${JSON.stringify(key)}:[${index}]`).join(",")}}`;

test("decoded object traversal matches frozen Java 8 concurrent-map resize and collision fixtures", () => {
  expect(vectors).toHaveLength(43);
  for (const { keys, order } of vectors) {
    const object = decodeLegacyJsonObject(objectText(keys));
    const entries = legacyJsonEntries(object);
    expect(entries.map(([key]) => key)).toEqual(order.map((index) => wireText(keys[index]!)));
    for (let index = 0; index < entries.length; index++)
      expect(entries[index]![1]).toEqual(sfs.array([sfs.int(order[index]!)]));
  }
});

test("combat helper maps use concurrent-map order on both sides and keep each associated army payload", () => {
  for (const { keys, order } of vectors) {
    const source = `{"atkHelpReport":${objectText(keys)},"defHelpReport":${objectText([...keys].reverse())}}`;
    const projected = mailContentsProjection([
      {
        uid: "report",
        type: 7,
        createTime: 1n,
        contents: Buffer.from("extra"),
        extra: Buffer.from(source),
      },
    ]);
    expect(projected.invalidIds).toEqual([]);
    const report = fields((projected.body.result!.value as Value[])[0]);
    const attackers = report.atkHelpReport!.value as Value[];
    expect(attackers.map((value) => fields(value).name!.value)).toEqual(
      order.map((index) => wireText(keys[index]!)),
    );
    for (let index = 0; index < attackers.length; index++)
      expect(fields(attackers[index]).armyInfo).toEqual(sfs.array([sfs.int(order[index]!)]));
    const defenders = report.defHelpReport!.value as Value[];
    expect(defenders.map((value) => fields(value).name!.value)).toEqual(
      legacyJsonEntries(decodeLegacyJsonObject(objectText([...keys].reverse()))).map(
        ([key]) => key,
      ),
    );
    expect(decode(encode(projected.body))).toEqual(projected.body);
  }
});

test("numeric-looking keys preserve parsed insertion history and duplicate properties do not add map entries", () => {
  const source = '{atkHelpReport:{"10":[1],"2":[2],"1":[3],"01":[4],"0":[5],"100":[6],"9":[7]}}';
  const report = fields(
    (
      mailContentsProjection([
        { uid: "report", type: 7, createTime: 1n, contents: Buffer.from(source), extra: null },
      ]).body.result!.value as Value[]
    )[0],
  );
  const expected = vectors.find((vector) => vector.name === "numeric-key-insertion")!;
  expect(
    (report.atkHelpReport!.value as Value[]).map((value) => fields(value).name!.value),
  ).toEqual(expected.order.map((index) => expected.keys[index]));
  const duplicates = decodeLegacyJsonObject("{x:1,y:2,x:3,class:7}");
  expect(legacyJsonEntries(duplicates)).toHaveLength(2);
  expect(duplicates.x).toEqual(sfs.array([sfs.int(1), sfs.int(3)]));
  expect(
    legacyJsonEntries(decodeLegacyJsonObject('{"__proto__":[],"constructor":[]}'))
      .map(([key]) => key)
      .sort(),
  ).toEqual(["__proto__", "constructor"]);
});

test("large object traversal matches frozen oracle digests through the existing 32767-key bound", () => {
  for (const [count, digest] of [
    [4097, "6db959e5d98f7740d436d06e96f99dc5f40f862e434c43a4a85b47d69cb686df"],
    [32767, "ac198c417010dd3d3668c816a1970c6491aca2e38a2f112600cb010ea9e96b36"],
  ] as const) {
    const keys = Array.from({ length: count }, (_, index) => `wide-${count - index - 1}`);
    const entries = legacyJsonEntries(decodeLegacyJsonObject(objectText(keys)));
    expect(entries).toHaveLength(count);
    expect(
      createHash("sha256")
        .update(entries.map(([key]) => key).join("\n"))
        .digest("hex"),
    ).toBe(digest);
  }
  const tooMany = Array.from({ length: 32768 }, (_, index) => `wide-${index}`);
  expect(() => decodeLegacyJsonObject(objectText(tooMany))).toThrow(ProtocolError);
});
