import { expect, test } from "bun:test";
import { decodeWorldResourceArmy } from "@opencok/messages/world-resource-army";
import { resourceRawArmyLoad } from "@opencok/rules/world-resource-detail";
import { Rules } from "@opencok/rules/game";
import vectors from "./fixtures/world-resource-army-vectors.json";

const data = (name: keyof typeof vectors) => Buffer.from(vectors[name], "base64");
const first = { owner: "owner", armsId: "100001", total: -2147483648, dead: 1, loadEffect: -100 };
const last = { owner: null, armsId: "A\0😀\ud800", total: 7, dead: 2, loadEffect: 2147483647 };

test("saved troop decoding preserves ArrayList and LinkedList order, shared entries and modified UTF-8", () => {
  for (const name of ["arrayList", "linkedList"] as const) {
    const bytes = data(name);
    const before = Buffer.from(bytes);
    const result = decodeWorldResourceArmy(bytes);
    expect(result).toEqual({ owner: "owner", cachedLoad: 123, soldiers: [first, first, last] });
    expect(result!.soldiers![0]).not.toBe(result!.soldiers![1]);
    expect(bytes).toEqual(before);
    result!.soldiers![0]!.total = 42;
    expect(decodeWorldResourceArmy(bytes)!.soldiers![0]!.total).toBe(-2147483648);
  }
});

test("null roots, empty lists and compatible missing fields retain Java serialization defaults", () => {
  expect(decodeWorldResourceArmy(data("nullRoot"))).toBeNull();
  expect(decodeWorldResourceArmy(data("empty"))).toEqual({
    owner: null,
    cachedLoad: 0,
    soldiers: [],
  });
  for (const name of ["nullLists", "missingFields"] as const)
    expect(decodeWorldResourceArmy(data(name))).toEqual({
      owner: null,
      cachedLoad: 0,
      soldiers: null,
    });
});

test("unrelated saved object graphs can contain primitive arrays, enums, maps, inherited fields and custom block data", () => {
  const result = decodeWorldResourceArmy(data("arrayList"))!;
  expect(Object.keys(result).sort()).toEqual(["cachedLoad", "owner", "soldiers"]);
  expect(result.soldiers).toHaveLength(3);
  expect(Object.keys(result.soldiers![0]!).sort()).toEqual([
    "armsId",
    "dead",
    "loadEffect",
    "owner",
    "total",
  ]);
});

test("saved troop records feed the raw-load rule without recalculating saved troop effects", () => {
  const decoded = decodeWorldResourceArmy(data("arrayList"))!;
  const rules = new Rules(new Map(), new Map(), new Map());
  rules.arms.set("100001", { load: "1" });
  const soldiers = decoded
    .soldiers!.slice(0, 2)
    .map((soldier) => ({ ...soldier, armsId: soldier.armsId! }));
  const state = { cachedLoad: decoded.cachedLoad, residentOwner: false, soldiers };
  expect(resourceRawArmyLoad(state, rules)).toBe(123);
  state.cachedLoad = 0;
  expect(resourceRawArmyLoad(state, rules)).toBe(858993472);
});

test("incompatible roots, field types, list entries and unsupported externalizable payloads reject", () => {
  for (const name of [
    "wrongFieldType",
    "wrongUid",
    "foreignRoot",
    "badElement",
    "externalizable",
  ] as const)
    expect(() => decodeWorldResourceArmy(data(name))).toThrow();
});

test("saved troop decoding rejects every truncated prefix and trailing bytes", () => {
  const bytes = data("arrayList");
  for (let length = 0; length < bytes.length; length++)
    expect(() => decodeWorldResourceArmy(bytes.subarray(0, length))).toThrow();
  for (const suffix of [Buffer.from([0]), Buffer.from([0x79]), data("nullRoot")])
    expect(() => decodeWorldResourceArmy(Buffer.concat([bytes, suffix]))).toThrow();
});

test("saved troop decoding bounds nesting, list size, byte length and invalid stream headers", () => {
  for (const name of ["deep", "wide"] as const)
    expect(() => decodeWorldResourceArmy(data(name))).toThrow();
  expect(() => decodeWorldResourceArmy(Buffer.alloc(65536))).toThrow();
  expect(() =>
    decodeWorldResourceArmy(new Uint8Array([0xac, 0xed, 0, 5, 0x70]) as Buffer),
  ).toThrow();
  const bytes = data("arrayList");
  for (const index of [0, 1, 2, 3, 4]) {
    const invalid = Buffer.from(bytes);
    invalid[index] = invalid[index]! ^ 0xff;
    expect(() => decodeWorldResourceArmy(invalid)).toThrow();
  }
});

test("saved soldier schema evolution defaults missing fields and rejects incompatible field types", () => {
  expect(decodeWorldResourceArmy(data("missingSoldierFields"))).toEqual({
    owner: null,
    cachedLoad: 0,
    soldiers: [{ owner: null, armsId: null, total: 0, dead: 0, loadEffect: 0 }],
  });
  expect(() => decodeWorldResourceArmy(data("wrongSoldierField"))).toThrow();
});

test("invalid handles, descriptor flags, duplicate fields and list count mismatches reject", () => {
  const original = data("arrayList");
  const root = Buffer.from("com.elex.cok.gameengine.world.march.WorldMarchGeneralArmy");
  const nameAt = original.indexOf(root);
  expect(nameAt).toBeGreaterThan(0);
  const flagsAt = nameAt + root.length + 8;
  for (const flags of [0, 1, 4, 6, 12, 18, 255]) {
    const bytes = Buffer.from(original);
    bytes[flagsAt] = flags;
    expect(() => decodeWorldResourceArmy(bytes)).toThrow();
  }
  const fields = Buffer.from(original);
  fields.writeUInt16BE(257, flagsAt + 1);
  expect(() => decodeWorldResourceArmy(fields)).toThrow();
  const reference = original.indexOf(Buffer.from([0x71, 0, 0x7e]));
  expect(reference).toBeGreaterThan(0);
  for (const handle of [0, 0x7dffff, 0x7effff, 0xffffffff]) {
    const bytes = Buffer.from(original);
    bytes.writeUInt32BE(handle, reference + 1);
    expect(() => decodeWorldResourceArmy(bytes)).toThrow();
  }
  const empty = data("empty");
  const countAt = empty.lastIndexOf(Buffer.from([0x77, 4, 0, 0, 0, 0]));
  expect(countAt).toBeGreaterThan(0);
  for (const count of [-1, 1, 4097, 2147483647]) {
    const bytes = Buffer.from(empty);
    bytes.writeInt32BE(count, countAt + 2);
    expect(() => decodeWorldResourceArmy(bytes)).toThrow();
  }
  const changedName = Buffer.from(original);
  const deadAt = changedName.indexOf(Buffer.from([0x49, 0, 4, 0x64, 0x65, 0x61, 0x64]));
  const totalAt = changedName.indexOf(Buffer.from([0x49, 0, 5, 0x74, 0x6f, 0x74, 0x61, 0x6c]));
  expect(deadAt).toBeGreaterThan(0);
  expect(totalAt).toBeGreaterThan(deadAt);
  const duplicate = Buffer.concat([
    changedName.subarray(0, totalAt),
    Buffer.from([0x49, 0, 4, 0x64, 0x65, 0x61, 0x64]),
    changedName.subarray(totalAt + 8),
  ]);
  expect(() => decodeWorldResourceArmy(duplicate)).toThrow();
});
