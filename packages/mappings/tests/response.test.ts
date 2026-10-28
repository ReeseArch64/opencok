import { expect, test } from "bun:test";
import { mailDeleted } from "@opencok/mappings/mail";
import { worldResourceOwner } from "@opencok/mappings/world-resource-detail";
import { validateFields } from "../src/validation.ts";
import { worldResourceOwnerSchema } from "@opencok/validations/world-resource-detail";
import { Type, encode, sfs } from "@opencok/messages/sfs";

test("mapping response data retains exact protocol tags and field order", () => {
    expect(mailDeleted(3)).toEqual({ delete: sfs.int(3) });
    const dto = {
        quantity: 1,
        speed: 1.5,
        startTime: 0n,
        remaining: 2,
        collected: 3,
        speedChangedAt: 4n,
        occupyEndTime: 5n,
    };
    const result = worldResourceOwner(dto);
    const expected = {
        q: sfs.int(1),
        spd: { type: Type.Float, value: 1.5 },
        sdt: sfs.long(0n),
        tq: sfs.int(2),
        collected: sfs.int(3),
        changeCollectSpdTime: sfs.long(4n),
        occupyEndTime: sfs.long(5n),
    };
    expect(encode(result)).toEqual(encode(expected));
    expect(Object.keys(result)).toEqual(Object.keys(expected));
});

test("transport and plain response validation run without rewriting SFS fields", () => {
    const fields = {
        occupyEndTime: sfs.long(5n),
        changeCollectSpdTime: sfs.long(4n),
        collected: sfs.int(3),
        tq: sfs.int(2),
        sdt: sfs.long(0n),
        spd: { type: Type.Float, value: 1.5 },
        q: sfs.int(1),
    };
    const before = encode(fields);
    expect(validateFields(worldResourceOwnerSchema, fields)).toBe(fields);
    expect(encode(fields)).toEqual(before);
    expect(() =>
        validateFields(worldResourceOwnerSchema, { ...fields, q: { type: Type.Int, value: "1" } })
    ).toThrow();
    expect(() => validateFields(worldResourceOwnerSchema, { ...fields, extra: sfs.int(1) }))
        .toThrow();
});
