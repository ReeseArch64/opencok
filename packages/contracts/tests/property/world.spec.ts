import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { encodePacket, decodePacket } from "../../src/binary";
import { mapQuery, mapRegion, type MapQuery, type MapRegion } from "../../src/world";
import { createQuery, createRegion, replaceUint } from "../support/world-fixtures";

const uint32 = fc.integer({ min: 0, max: 0xffffffff });
const coordinate = fc.integer({ min: 0, max: 1200 });
const queryArbitrary: fc.Arbitrary<MapQuery> = fc.record({
    requestId: uint32,
    kingdomId: uint32,
    minX: coordinate,
    minY: coordinate,
    maxX: coordinate,
    maxY: coordinate,
});
const nameArbitrary = fc.oneof(
    fc.string({ maxLength: 64 }),
    fc.array(fc.constantFrom("é", "中", "🏰", "\u0000", "a"), { maxLength: 16 }).map((parts) =>
        parts.join("")
    ),
);
const regionArbitrary: fc.Arbitrary<MapRegion> = fc.record({
    requestId: uint32,
    status: fc.integer({ min: 0, max: 2 }),
    kingdomId: uint32,
    name: nameArbitrary,
    columns: coordinate,
    rows: coordinate,
    objects: fc.array(
        fc.record({
            id: uint32,
            kind: fc.integer({ min: 0, max: 4 }),
            x: coordinate,
            y: coordinate,
            width: fc.integer({ min: 0, max: 16 }),
            height: fc.integer({ min: 0, max: 16 }),
            level: fc.integer({ min: 0, max: 100 }),
        }),
        { maxLength: 16 },
    ),
    blocked: fc.array(fc.record({ x: coordinate, y: coordinate }), { maxLength: 32 }),
});
const packetArbitrary = fc.oneof(
    queryArbitrary.map((value) => ({ opcode: 16, value })),
    regionArbitrary.map((value) => ({ opcode: 17, value })),
);
const parameters = { seed: 0xc0ffee, numRuns: 200 };

describe("bounded world codec properties", () => {
    it("round trips every generated query without changing caller state", () => {
        fc.assert(
            fc.property(queryArbitrary, (value) => {
                const before = structuredClone(value);
                expect(mapQuery.parse(value)).toEqual(value);
                expect(decodePacket(encodePacket(16, value))).toEqual({ opcode: 16, value });
                expect(value).toEqual(before);
            }),
            parameters,
        );
    });

    it("round trips generated regions with multibyte names and nested collections", () => {
        fc.assert(
            fc.property(regionArbitrary, (value) => {
                const before = structuredClone(value);
                expect(mapRegion.parse(value)).toEqual(value);
                const bytes = encodePacket(17, value);
                const decoded = decodePacket(bytes);
                expect(decoded).toEqual({ opcode: 17, value });
                expect(encodePacket(decoded.opcode, decoded.value)).toEqual(bytes);
                expect(value).toEqual(before);
            }),
            parameters,
        );
    });

    it("rejects an arbitrary proper prefix of every generated packet", () => {
        fc.assert(
            fc.property(packetArbitrary, fc.nat(), ({ opcode, value }, cut) => {
                const bytes = encodePacket(opcode, value);
                const prefix = bytes.subarray(0, cut % bytes.length);
                expect(() => decodePacket(prefix)).toThrow();
            }),
            parameters,
        );
    });

    it("rejects all nonempty trailing byte sequences", () => {
        fc.assert(
            fc.property(
                packetArbitrary,
                fc.uint8Array({ minLength: 1, maxLength: 16 }),
                ({ opcode, value }, suffix) => {
                    const bytes = encodePacket(opcode, value);
                    expect(() => decodePacket(Uint8Array.from([...bytes, ...suffix]))).toThrow(
                        "Trailing packet bytes",
                    );
                },
            ),
            parameters,
        );
    });

    it("decodes identically from arbitrary framed byte offsets", () => {
        fc.assert(
            fc.property(
                packetArbitrary,
                fc.uint8Array({ minLength: 1, maxLength: 32 }),
                ({ opcode, value }, prefix) => {
                    const encoded = encodePacket(opcode, value);
                    const buffer = Uint8Array.from([...prefix, ...encoded, 255]);
                    const input = buffer.subarray(prefix.length, buffer.length - 1);
                    const before = buffer.slice();
                    expect(decodePacket(input)).toEqual({ opcode, value });
                    expect(buffer).toEqual(before);
                },
            ),
            parameters,
        );
    });

    it("rejects unsupported versions regardless of the valid payload", () => {
        fc.assert(
            fc.property(
                packetArbitrary,
                fc.integer({ min: 2, max: 255 }),
                ({ opcode, value }, version) => {
                    const bytes = encodePacket(opcode, value);
                    bytes[0] = version;
                    expect(() => decodePacket(bytes)).toThrow("Invalid packet");
                },
            ),
            parameters,
        );
    });

    it("rejects every generated out-of-range coordinate at both boundaries", () => {
        fc.assert(
            fc.property(fc.integer({ min: 1201, max: 0xffffffff }), (coordinate) => {
                expect(() => encodePacket(16, createQuery({ minX: coordinate }))).toThrow();
                const bytes = replaceUint(encodePacket(16, createQuery()), 10, coordinate);
                expect(() => decodePacket(bytes)).toThrow();
            }),
            parameters,
        );
    });

    it("distinguishes schema character bounds from the UTF-8 byte cap", () => {
        fc.assert(
            fc.property(fc.integer({ min: 33, max: 64 }), (length) => {
                const value = createRegion({ name: "é".repeat(length) });
                expect(mapRegion.safeParse(value).success).toBe(true);
                expect(() => encodePacket(17, value)).toThrow("String too long");
            }),
            parameters,
        );
    });
});
