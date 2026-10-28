import { expect, test } from "bun:test";
import { encodeJavaIntMap, decodeJavaIntMap } from "@opencok/messages/java-int-map";
test("Java integer map snapshots retain native descriptors, signed counters and modified UTF keys", () => {
    for (
        const values of [
            new Map<string, number>(),
            new Map([
                ["300100", 200],
                ["300200", 150],
                ["nul\0emoji😀", -2147483648],
                ["max", 2147483647],
                ["zero", 0],
            ]),
        ]
    )
    {
        const bytes = encodeJavaIntMap(values);
        expect(bytes.subarray(0, 4).toString("hex")).toBe("aced0005");
        expect(decodeJavaIntMap(bytes)).toEqual(values);
        expect(bytes.length).toBeLessThanOrEqual(65535);
    }
    expect(decodeJavaIntMap(encodeJavaIntMap(null))).toBeNull();
});
test("Java integer map snapshot encoding rejects fractional or oversized unsupported actor state", () => {
    for (const value of [NaN, Infinity, 1.5, 2147483648, -2147483649])
    {
        expect(() => encodeJavaIntMap(new Map([["unit", value]]))).toThrow();
    }
    expect(() => encodeJavaIntMap(new Map([["x".repeat(65536), 1]]))).toThrow();
    expect(() => encodeJavaIntMap(new Map(Array.from({ length: 4097 }, (_, i) => [String(i), i]))))
        .toThrow();
});
