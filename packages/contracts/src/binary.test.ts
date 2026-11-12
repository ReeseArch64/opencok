import { expect, test } from "bun:test";
import { encodePacket, decodePacket, maxPacketBytes, wireSchema } from "./binary";
import { mapQuery, mapRegion } from "./world";
import fixture from "../tests/fixtures/world.json";
import { createQuery, createRegion, replaceUint } from "../tests/support/world-fixtures";

test("shared Go/Dart/TypeScript fixtures round trip byte for byte", () => {
    for (const bytes of Object.values(fixture))
    {
        const input = Uint8Array.from(bytes);
        const decoded = decodePacket(input);
        expect(encodePacket(decoded.opcode, decoded.value)).toEqual(input);
        for (let length = 0; length < input.length; length++)
        {
            expect(() => decodePacket(input.slice(0, length))).toThrow();
        }
        expect(() => decodePacket(Uint8Array.from([...input, 0]))).toThrow();
    }
});
test("unknown opcodes, versions and oversized array lengths are rejected", () => {
    const bytes = Uint8Array.from(fixture.region);
    for (
        const [offset, value] of [
            [0, 2],
            [1, 99],
            [31, 255],
        ] as const
    )
    {
        const invalid = bytes.slice();
        invalid[offset] = value;
        expect(() => decodePacket(invalid)).toThrow();
    }
    expect(() => decodePacket(new Uint8Array(65537))).toThrow();
});

test("the query wire layout uses a version, opcode and six big-endian uint32 fields", () => {
    const value = createQuery({ requestId: 0xffffffff, kingdomId: 0x12345678, minX: 0 });
    const encoded = encodePacket(16, value);
    expect(maxPacketBytes).toBe(65536);
    expect(encoded.length).toBe(26);
    expect(Array.from(encoded.slice(0, 14))).toEqual([
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
        0,
        0,
        0,
        0,
    ]);
    expect(decodePacket(encoded)).toEqual({ opcode: 16, value });
});

test("decoding honors a subarray's offset and does not mutate input", () => {
    const framed = Uint8Array.from([99, ...fixture.region, 98]);
    const original = framed.slice();
    expect(decodePacket(framed.subarray(1, -1))).toEqual({
        opcode: 17,
        value: createRegion(),
    });
    expect(framed).toEqual(original);
});

test("encoded buffers and decoded objects are independent between calls", () => {
    const first = encodePacket(16, createQuery());
    const second = encodePacket(16, createQuery());
    first.fill(0);
    expect(Array.from(second)).toEqual(fixture.query);
    const firstValue = decodePacket(Uint8Array.from(fixture.region)).value;
    const secondValue = decodePacket(Uint8Array.from(fixture.region)).value;
    expect(firstValue).toEqual(secondValue);
    expect(firstValue).not.toBe(secondValue);
});

test("encoding rejects unknown opcodes and invalid strict payloads", () => {
    for (const opcode of [-1, 0, 18, 256, NaN])
    {
        expect(() => encodePacket(opcode, createQuery())).toThrow("Unknown packet");
    }
    for (const value of [null, {}, { ...createQuery(), extra: 1 }, createQuery({ minX: 1201 })])
    {
        expect(() => encodePacket(16, value)).toThrow();
    }
});

test("UTF-8 names use byte lengths and enforce the byte cap", () => {
    for (const name of ["", "a".repeat(64), "é".repeat(32), "🏰".repeat(16)])
    {
        const value = createRegion({ name });
        const bytes = encodePacket(17, value);
        expect(new DataView(bytes.buffer).getUint32(14)).toBe(
            new TextEncoder().encode(name).length,
        );
        expect(decodePacket(bytes)).toEqual({ opcode: 17, value });
    }
    expect(() => encodePacket(17, createRegion({ name: "é".repeat(33) }))).toThrow(
        "String too long",
    );
    expect(() => encodePacket(17, createRegion({ name: "a".repeat(65) }))).toThrow();
});

test("invalid string counts and malformed UTF-8 are rejected", () => {
    const bytes = encodePacket(17, createRegion({ name: "a" }));
    expect(() => decodePacket(replaceUint(bytes, 14, 65))).toThrow("Invalid string");
    expect(() => decodePacket(replaceUint(bytes, 14, 64))).toThrow("Invalid string");
    const malformed = bytes.slice();
    malformed[18] = 255;
    expect(() => decodePacket(malformed)).toThrow();
});

test("empty and maximally bounded collections round trip", () => {
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
        expect(decodePacket(encodePacket(17, value))).toEqual({ opcode: 17, value });
    }
});

test("oversized collection prefixes fail before reading their contents", () => {
    const bytes = encodePacket(17, createRegion({ name: "", objects: [], blocked: [] }));
    expect(() => decodePacket(replaceUint(bytes, 26, 257))).toThrow("Invalid array");
    expect(() => decodePacket(replaceUint(bytes, 30, 4097))).toThrow("Invalid array");
});

test("decoded integers still pass domain validation", () => {
    expect(() => decodePacket(replaceUint(Uint8Array.from(fixture.query), 10, 1201))).toThrow();
    expect(() => decodePacket(replaceUint(Uint8Array.from(fixture.region), 6, 3))).toThrow();
});

test("wire schema retains bounded field types and insertion order", () => {
    const query = wireSchema(mapQuery);
    const region = wireSchema(mapRegion);
    expect(Object.keys(query.properties!)).toEqual([
        "requestId",
        "kingdomId",
        "minX",
        "minY",
        "maxX",
        "maxY",
    ]);
    expect(query.properties!.requestId).toMatchObject({ type: "integer", maximum: 0xffffffff });
    expect(region.properties!.name).toMatchObject({ type: "string", maxLength: 64 });
    expect(region.properties!.objects).toMatchObject({ type: "array", maxItems: 256 });
    expect(region.properties!.blocked).toMatchObject({ type: "array", maxItems: 4096 });
});
