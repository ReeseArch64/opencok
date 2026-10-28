import { expect, test } from "bun:test";
import { z } from "zod";
import { Type, encode, sfs, type Value } from "@opencok/messages/sfs";
import { wireValue, wireFields } from "@opencok/messages/validations/sfs";
import { field, responseFieldsSchema } from "@opencok/messages/validations/response";
import { validateFields, validateValue } from "@opencok/messages/validations/fields";

test("wire validation retains exact signed widths and rejects coercion and invalid tags", () => {
    const integerTypes = [
        [Type.Byte, -128, 127],
        [Type.Short, -32768, 32767],
        [Type.Int, -2147483648, 2147483647],
    ] as const;

    for (const [type, minimum, maximum] of integerTypes)
    {
        for (const value of [minimum, maximum])
        {
            expect(wireValue.safeParse({ type, value }).success).toBe(true);
        }

        for (const value of [minimum - 1, maximum + 1, 0.5, NaN, Infinity, "1"])
        {
            expect(wireValue.safeParse({ type, value }).success).toBe(false);
        }
    }

    for (const value of [-9223372036854775808n, 9223372036854775807n])
    {
        expect(wireValue.safeParse(sfs.long(value)).success).toBe(true);
    }

    for (const value of [-9223372036854775809n, 9223372036854775808n, 1, "1"])
    {
        expect(wireValue.safeParse({ type: Type.Long, value }).success).toBe(false);
    }

    expect(wireValue.safeParse({ type: -1, value: null }).success).toBe(false);
    expect(wireValue.safeParse({ ...sfs.int(1), extra: true }).success).toBe(false);
});

test("wire validation bounds UTF-8 keys, values, buffers and typed arrays", () => {
    expect(wireValue.safeParse(sfs.string("é".repeat(16383))).success).toBe(true);
    expect(wireValue.safeParse(sfs.string("é".repeat(16384))).success).toBe(false);
    expect(wireFields.safeParse({ ["é".repeat(127)]: sfs.int(1) }).success).toBe(true);
    expect(wireFields.safeParse({ ["é".repeat(128)]: sfs.int(1) }).success).toBe(false);
    expect(wireValue.safeParse({ type: Type.Bytes, value: Buffer.alloc(4 * 1024 * 1024) }).success)
        .toBe(true);
    expect(
        wireValue.safeParse({ type: Type.Bytes, value: Buffer.alloc(4 * 1024 * 1024 + 1) }).success,
    ).toBe(false);
    expect(wireValue.safeParse({ type: Type.IntArray, value: Array(32767).fill(1) }).success)
        .toBe(true);
    expect(wireValue.safeParse({ type: Type.IntArray, value: Array(32768).fill(1) }).success)
        .toBe(false);
    expect(wireValue.safeParse({ type: Type.ShortArray, value: [32768] }).success).toBe(false);
    expect(wireValue.safeParse({ type: Type.LongArray, value: [1] }).success).toBe(false);
});

test("schema adapters preserve original identities, native tags, key order and prototype keys", () => {
    const entries = Object.fromEntries([
        ["__proto__", sfs.int(7)],
        ["constructor", sfs.string("literal")],
        ["nested", sfs.object({ second: sfs.long(9n), first: sfs.int(1) })],
    ]);
    const before = encode(entries);
    const keys = Object.keys(entries);

    expect(validateFields(responseFieldsSchema, entries)).toBe(entries);
    expect(Object.hasOwn(entries, "__proto__")).toBe(true);
    expect(Object.keys(entries)).toEqual(keys);
    expect(encode(entries)).toEqual(before);

    const value = sfs.object(entries);
    expect(validateValue(responseFieldsSchema, value)).toBe(value);
    expect(encode(entries)).toEqual(before);

    const array = sfs.array([sfs.int(1), sfs.int(2)]);
    expect(validateValue(z.array(field.int), array)).toBe(array);
    expect(() => validateFields(z.strictObject({}), entries)).toThrow(z.ZodError);
    expect(encode(entries)).toEqual(before);
    expect(() => validateValue(field.int, { type: Type.Int, value: "1" })).toThrow(z.ZodError);
    expect(() => validateValue(field.int, sfs.string("1"))).toThrow(z.ZodError);
});

test("legacy floating values retain their native tags and numeric identities", () => {
    for (const type of [Type.Float, Type.Double])
    {
        for (const value of [NaN, Infinity, -Infinity, -0])
        {
            const tagged: Value = { type, value };
            expect(validateValue(field.double, tagged)).toBe(tagged);
            expect(Object.is(wireValue.parse(tagged).value, value)).toBe(true);
        }
    }
});
