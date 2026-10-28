import { expect, test } from "bun:test";
import { z } from "zod";
import type { MailDeletedResponse } from "@opencok/contracts/responses/mail";
import type { WorldResourceOwnerResponse } from "@opencok/contracts/responses/world-resource-detail";
import { mailDeletedSchema } from "@opencok/validations/mail";
import { worldSearchSchema } from "@opencok/validations/world-search";
import { worldResourceOwnerSchema } from "@opencok/validations/world-resource-detail";
import { responseFieldsSchema, responseValueSchema } from "@opencok/validations/response";

test("response contracts are validated independently", () => {
    const dto: MailDeletedResponse = { delete: 3 };
    expect(mailDeletedSchema.parse(dto)).toEqual(dto);
    for (const data of [{ delete: 3, owner: "private" }, { delete: "3" }, {}])
    {
        expect(() => mailDeletedSchema.parse(data)).toThrow(z.ZodError);
    }
});

test("plain response schemas enforce signed integer widths without coercion", () => {
    for (const value of [-2147483648, 2147483647])
    {
        expect(mailDeletedSchema.parse({ delete: value }).delete).toBe(value);
    }
    for (const value of [-2147483649, 2147483648, 1.5, NaN, Infinity, "1", null])
    {
        expect(() => mailDeletedSchema.parse({ delete: value })).toThrow(z.ZodError);
    }
    const dto: WorldResourceOwnerResponse = {
        q: 1,
        spd: 1.5,
        sdt: -9223372036854775808n,
        tq: 2,
        collected: 3,
        changeCollectSpdTime: 0n,
        occupyEndTime: 9223372036854775807n,
    };
    expect(worldResourceOwnerSchema.parse(dto).occupyEndTime).toBe(9223372036854775807n);
    for (const sdt of [-9223372036854775809n, 9223372036854775808n, 1, "1"])
    {
        expect(() => worldResourceOwnerSchema.parse({ ...dto, sdt })).toThrow(z.ZodError);
    }
});

test("plain search schemas validate nested entries, optional fields and duplicate identities", () => {
    const entry = { pointId: 1203 as const, uid: "player", name: "Name", abbr: "A" };
    expect(worldSearchSchema.parse({ list: [entry] })).toEqual({ list: [entry] });
    expect(() => worldSearchSchema.parse({ list: [{ ...entry, pic: 1 }] })).toThrow(z.ZodError);
    expect(() => worldSearchSchema.parse({ list: [entry, entry] })).toThrow(z.ZodError);
    for (const uid of ["", "x".repeat(256), "bad\0id", "\ud800"])
    {
        expect(() => worldSearchSchema.parse({ list: [{ ...entry, uid }] })).toThrow(z.ZodError);
    }
});

test("dynamic response validation preserves literal prototype keys and rejects invalid nested values", () => {
    const input = Object.fromEntries([
        ["__proto__", 2],
        ["constructor", "literal"],
        ["nested", { delete: 1 }],
    ]);
    const parsed = responseFieldsSchema.parse(input);
    expect(Object.hasOwn(parsed, "__proto__")).toBe(true);
    expect(parsed).toEqual(input);
    expect(Object.getPrototypeOf(parsed)).toBe(Object.prototype);
    expect(responseFieldsSchema.safeParse({ nested: { value: undefined } }).success).toBe(false);
});

test("response validation retains legacy floating values and bounds UTF-8 text and collections", () => {
    for (const value of [NaN, Infinity, -Infinity, -0])
    {
        expect(responseValueSchema.safeParse(value).success).toBe(true);
    }
    expect(responseValueSchema.safeParse("é".repeat(16384)).success).toBe(false);
    expect(responseValueSchema.safeParse(Array.from({ length: 32768 }, () => null)).success).toBe(
        false,
    );
    expect(responseFieldsSchema.safeParse({ ["é".repeat(128)]: 1 }).success).toBe(false);
});
