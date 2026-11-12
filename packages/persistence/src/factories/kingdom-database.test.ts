import { describe, expect, test } from "bun:test";
import { kingdomDatabase } from "./kingdom-database";

describe("kingdom database names", () => {
    test.each([1, 2, 2_147_483_646, 2_147_483_647])("routes kingdom %s", id => {
        expect(kingdomDatabase(id)).toBe(`kingdom_${id}`);
    });

    test.each([0, -0, -1, 0.5, 1.5, 2_147_483_648, NaN, Infinity, -Infinity])(
        "rejects invalid identifier %s",
        id => {
            expect(() => kingdomDatabase(id)).toThrow(RangeError);
        },
    );
});
