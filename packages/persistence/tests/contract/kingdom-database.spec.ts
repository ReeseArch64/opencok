import { describe, expect, test } from "vitest";
import { kingdomDatabase } from "../../src/factories/kingdom-database";

describe("kingdom database naming contract", () => {
    test.each([1, 2, 2_147_483_646, 2_147_483_647])("serializes the SQL integer %s", id => {
        expect(kingdomDatabase(id)).toBe(`kingdom_${id}`);
    });

    test.each([
        0,
        -0,
        -1,
        0.5,
        1.5,
        2_147_483_647.5,
        2_147_483_648,
        NaN,
        Infinity,
        -Infinity,
        "1",
        null,
        undefined,
        true,
        {},
        [],
    ].map(input => ({ input })))("rejects non-domain identifier %j", ({ input }) => {
        expect(() => kingdomDatabase(input as number)).toThrow(RangeError);
        expect(() => kingdomDatabase(input as number)).toThrow("Identificador de reino inválido");
    });
});
