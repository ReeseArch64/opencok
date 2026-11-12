import { describe, expect, it } from "vitest";
import { encodePacket, decodePacket, maxPacketBytes } from "../../src/binary";
import { mapQuery, mapRegion } from "../../src/world";
import fixture from "../fixtures/world.json";
import { createQuery, createRegion, replaceUint } from "../support/world-fixtures";

describe("Zod schemas and binary codec", () => {
    it.each(
        [
            [16, fixture.query, createQuery()],
            [17, fixture.region, createRegion()],
        ] as const,
    )("matches cross-language fixture for opcode %i", (opcode, bytes, value) => {
        expect(Array.from(encodePacket(opcode, value))).toEqual(bytes);
        expect(decodePacket(Uint8Array.from(bytes))).toEqual({ opcode, value });
        for (let length = 0; length < bytes.length; length++)
        {
            expect(() => decodePacket(Uint8Array.from(bytes.slice(0, length)))).toThrow();
        }
        expect(() => decodePacket(Uint8Array.from([...bytes, 0]))).toThrow("Trailing packet bytes");
    });

    it("writes the version, opcode and big-endian integer widths explicitly", () => {
        expect(maxPacketBytes).toBe(65536);
        const bytes = encodePacket(
            16,
            createQuery({ requestId: 0xffffffff, kingdomId: 0x12345678 }),
        );
        expect(Array.from(bytes.slice(0, 10))).toEqual([
            1,
            16,
            255,
            255,
            255,
            255,
            18,
            52,
            86,
            120,
        ]);
        expect(bytes.length).toBe(26);
    });

    it("validates decoded uint32 values against their schema bounds", () => {
        for (const offset of [10, 14, 18, 22])
        {
            expect(() => decodePacket(replaceUint(Uint8Array.from(fixture.query), offset, 1201)))
                .toThrow();
        }
        const region = Uint8Array.from(fixture.region);
        for (const [offset, value] of [[6, 3], [23, 1201], [27, 1201], [39, 5], [59, 101]])
        {
            expect(() => decodePacket(replaceUint(region, offset!, value!))).toThrow();
        }
    });

    it("rejects invalid framing and unknown outbound opcodes", () => {
        for (
            const bytes of [
                new Uint8Array(),
                Uint8Array.of(1),
                Uint8Array.of(0, 16),
                Uint8Array.of(2, 16),
                new Uint8Array(65537),
            ]
        )
        {
            expect(() => decodePacket(bytes)).toThrow("Invalid packet");
        }
        const oversized = new Uint8Array(maxPacketBytes + 1);
        oversized.set([1, 16]);
        expect(() => decodePacket(oversized)).toThrow("Invalid packet");
        const atLimit = new Uint8Array(maxPacketBytes);
        atLimit.set([1, 99]);
        expect(() => decodePacket(atLimit)).toThrow("Unknown packet");
        expect(() => decodePacket(Uint8Array.of(1, 99))).toThrow("Unknown packet");
        for (const opcode of [-1, 0, 18, 256, NaN])
        {
            expect(() => encodePacket(opcode, createQuery())).toThrow("Unknown packet");
        }
    });

    it("rejects invalid input rather than truncating or coercing values", () => {
        for (
            const value of [
                null,
                {},
                { ...createQuery(), extra: true },
                createQuery({ minX: 1201 }),
            ]
        )
        {
            expect(() => encodePacket(16, value)).toThrow();
        }
        const object = createRegion().objects[0]!;
        for (
            const value of [
                createRegion({ name: "x".repeat(65) }),
                createRegion({ objects: Array.from({ length: 257 }, () => ({ ...object })) }),
                createRegion({ blocked: Array.from({ length: 4097 }, () => ({ x: 0, y: 0 })) }),
                { ...createRegion(), blocked: [{ x: 0, y: 0, extra: true }] },
            ]
        )
        {
            expect(() => encodePacket(17, value)).toThrow();
        }
    });

    it.each(["", "a".repeat(64), "é".repeat(32), "🏰".repeat(16)])(
        "uses UTF-8 byte lengths for %j",
        (name) => {
            const value = createRegion({ name });
            const encoded = encodePacket(17, value);
            expect(new DataView(encoded.buffer).getUint32(14)).toBe(
                new TextEncoder().encode(name).length,
            );
            expect(decodePacket(encoded)).toEqual({ opcode: 17, value });
        },
    );

    it("rejects schema-valid strings that exceed the UTF-8 byte limit", () => {
        const value = createRegion({ name: "é".repeat(33) });
        expect(mapRegion.safeParse(value).success).toBe(true);
        expect(() => encodePacket(17, value)).toThrow("String too long");
    });

    it("rejects oversized or truncated strings and invalid UTF-8", () => {
        const bytes = encodePacket(17, createRegion({ name: "a" }));
        expect(() => decodePacket(replaceUint(bytes, 14, 65))).toThrow("Invalid string");
        expect(() => decodePacket(replaceUint(bytes, 14, 64))).toThrow("Invalid string");
        for (const invalid of [0xff, 0xc0, 0x80])
        {
            const malformed = bytes.slice();
            malformed[18] = invalid;
            expect(() => decodePacket(malformed)).toThrow();
        }
    });

    it("rejects oversized UTF-8 byte sequences even when the decoded name fits the character limit", () => {
        const base = encodePacket(17, createRegion({ name: "" }));
        const name = new TextEncoder().encode("é".repeat(33));
        const bytes = new Uint8Array(base.length + name.length);
        bytes.set(base.subarray(0, 18));
        new DataView(bytes.buffer).setUint32(14, name.length);
        bytes.set(name, 18);
        bytes.set(base.subarray(18), 18 + name.length);
        expect(() => decodePacket(bytes)).toThrow("Invalid string");
    });

    it("distinguishes a complete string from the missing fields that follow it", () => {
        const bytes = encodePacket(17, createRegion({ name: "a" }));
        expect(() => decodePacket(bytes.subarray(0, 19))).toThrow("Truncated packet");
    });

    it("round trips empty and maximally sized collections", () => {
        const object = createRegion().objects[0]!;
        for (
            const value of [
                createRegion({ name: "", objects: [], blocked: [] }),
                createRegion({
                    objects: Array.from({ length: 256 }, () => ({ ...object })),
                    blocked: Array.from({ length: 4096 }, () => ({ x: 1200, y: 0 })),
                }),
            ]
        )
        {
            expect(mapRegion.parse(value)).toEqual(value);
            expect(decodePacket(encodePacket(17, value))).toEqual({ opcode: 17, value });
        }
    });

    it("checks collection counts before allocating or reading items", () => {
        const bytes = encodePacket(17, createRegion({ name: "", objects: [], blocked: [] }));
        for (const count of [257, 0xffffffff])
        {
            expect(() => decodePacket(replaceUint(bytes, 26, count))).toThrow("Invalid array");
        }
        for (const count of [4097, 0xffffffff])
        {
            expect(() => decodePacket(replaceUint(bytes, 30, count))).toThrow("Invalid array");
        }
        expect(() => decodePacket(bytes.subarray(0, 29))).toThrow("Truncated packet");
    });

    it("respects input view boundaries and leaves caller-owned values unchanged", () => {
        const value = createRegion();
        const original = structuredClone(value);
        const encoded = encodePacket(17, value);
        const framed = Uint8Array.from([99, 98, ...encoded, 97]);
        const before = framed.slice();
        expect(decodePacket(framed.subarray(2, -1))).toEqual({ opcode: 17, value });
        expect(framed).toEqual(before);
        expect(value).toEqual(original);
        const next = encodePacket(17, value);
        encoded.fill(0);
        expect(Array.from(next)).toEqual(fixture.region);
        expect(mapQuery.parse(createQuery())).toEqual(createQuery());
    });
});
