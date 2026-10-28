import { expect, test } from "bun:test";
import { favoriteName } from "@opencok/world/rules/world-favorites";
import oracle from "./fixtures/world-favorite-names.json";

test("favorite name validation matches all BMP primitive Java cases and documents storage-only exclusions", () => {
    const bitmap = Buffer.from(oracle.bmpAccepted, "base64");
    expect(bitmap.length).toBe(8192);
    for (let code = 0; code < 65536; code++)
    {
        const legacy = !!(bitmap[code >>> 3]! & (1 << (code & 7)));
        const expected = legacy && code !== 0 && (code < 0xd800 || code > 0xdfff);
        expect(favoriteName("X" + String.fromCharCode(code) + "Y"), code.toString(16)).toBe(
            expected,
        );
    }
    for (const row of oracle.cases)
    {
        expect(favoriteName(row.name)).toBe(
            row.legacy && row.name.length <= 255 && row.name.isWellFormed()
                && !row.name.includes("\0"),
        );
    }
    for (const value of [null, undefined, 1, {}])
    {
        expect(favoriteName(value)).toBe(false);
    }
});
