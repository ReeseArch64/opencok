import { expect, test } from "bun:test";
import { z } from "zod";
import { createZodDto, wire, wireFields, wireValue } from "@opencok/dtos/dto";
import { MailDeletedDto, mailDeleted } from "@opencok/dtos/mail";
import { WorldSearchDto, worldSearch } from "@opencok/dtos/world-search";
import { WorldResourceOwnerDto } from "@opencok/dtos/world-resource-detail";
import { Type, encode, sfs } from "@opencok/messages/sfs";

test("existing adapters construct DTO instances and schemas reject undeclared fields", () => {
  expect(mailDeleted(3)).toBeInstanceOf(MailDeletedDto);
  expect(mailDeleted(3)).toEqual({ delete: sfs.int(3) });
  expect(() => new MailDeletedDto({ delete: sfs.int(3), owner: sfs.string("private") })).toThrow(
    z.ZodError,
  );
  expect(() => new MailDeletedDto({ delete: sfs.long(3n) })).toThrow(z.ZodError);
  expect(() => new MailDeletedDto({})).toThrow(z.ZodError);
});

test("DTO construction enforces signed integer widths without coercion", () => {
  for (const value of [-2147483648, 2147483647])
    expect(new MailDeletedDto({ delete: sfs.int(value) }).delete.value).toBe(value);
  for (const value of [-2147483649, 2147483648, 1.5, NaN, Infinity, "1", null])
    expect(() => new MailDeletedDto({ delete: { type: Type.Int, value } })).toThrow(z.ZodError);
  const input = {
    q: sfs.int(1),
    spd: { type: Type.Float, value: 1.5 },
    sdt: sfs.long(-9223372036854775808n),
    tq: sfs.int(2),
    collected: sfs.int(3),
    changeCollectSpdTime: sfs.long(0n),
    occupyEndTime: sfs.long(9223372036854775807n),
  };
  expect(new WorldResourceOwnerDto(input).occupyEndTime.value).toBe(9223372036854775807n);
  for (const value of [-9223372036854775809n, 9223372036854775808n, 1, "1"])
    expect(() => new WorldResourceOwnerDto({ ...input, sdt: { type: Type.Long, value } })).toThrow(
      z.ZodError,
    );
});

test("schemas validate nested search entries, optional fields and duplicate identities", () => {
  const dto = worldSearch([{ uid: "player", name: "Name", abbr: "A" }]);
  expect(dto).toBeInstanceOf(WorldSearchDto);
  expect(WorldSearchDto.schema.safeParse(dto).success).toBe(true);
  const entry = {
    pointId: sfs.int(1203),
    uid: sfs.string("player"),
    name: sfs.string("Name"),
    abbr: sfs.string("A"),
  };
  expect(
    () => new WorldSearchDto({ list: sfs.array([sfs.object({ ...entry, pic: sfs.int(1) })]) }),
  ).toThrow(z.ZodError);
  expect(
    () => new WorldSearchDto({ list: sfs.array([sfs.object(entry), sfs.object(entry)]) }),
  ).toThrow(z.ZodError);
  for (const uid of ["", "x".repeat(256), "bad\0id", "\ud800"])
    expect(
      () =>
        new WorldSearchDto({ list: sfs.array([sfs.object({ ...entry, uid: sfs.string(uid) })]) }),
    ).toThrow(z.ZodError);
});

test("class construction preserves nested field order and exact encoded bytes", () => {
  class PacketDto extends createZodDto(
    z.strictObject({ alpha: wire.int, nested: wire.object(wireFields) }),
  ) {}
  const input = {
    nested: sfs.object({ second: sfs.string("two"), first: sfs.int(1) }),
    alpha: sfs.int(2),
  };
  const dto = new PacketDto(input);
  expect(Object.keys(dto)).toEqual(["nested", "alpha"]);
  expect(encode(dto)).toEqual(encode(input));
  expect(input.nested.value).toEqual({ second: sfs.string("two"), first: sfs.int(1) });
});

test("dynamic wire fields preserve prototype-named keys and accept nested DTO instances", () => {
  class PacketDto extends createZodDto(wireFields) {}
  const input = Object.fromEntries([
    ["__proto__", sfs.int(2)],
    ["constructor", sfs.string("literal")],
    ["nested", sfs.object(mailDeleted(1))],
  ]);
  const dto = new PacketDto(input);
  expect(Object.hasOwn(dto, "__proto__")).toBe(true);
  expect(Object.getPrototypeOf(dto)).toBe(PacketDto.prototype);
  expect(encode(dto)).toEqual(encode(input));
  expect(
    () => new PacketDto({ nested: sfs.object({ hidden: { type: Type.Int, value: "1" } }) }),
  ).toThrow(z.ZodError);
});

test("wire validation retains legacy floating special values and bounds UTF-8 strings and arrays", () => {
  for (const value of [NaN, Infinity, -Infinity, -0]) {
    expect(wireValue.safeParse({ type: Type.Float, value }).success).toBe(true);
    expect(wireValue.safeParse(sfs.double(value)).success).toBe(true);
  }
  expect(wireValue.safeParse(sfs.string("é".repeat(16384))).success).toBe(false);
  expect(
    wireValue.safeParse(sfs.array(Array.from({ length: 32768 }, () => sfs.null()))).success,
  ).toBe(false);
  expect(wireFields.safeParse({ ["é".repeat(128)]: sfs.int(1) }).success).toBe(false);
});
