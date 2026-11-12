import { expect, test } from "bun:test";
import { encodePacket, decodePacket } from "./binary";
import fixture from "../../../gameserver/testdata/world.json";

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
