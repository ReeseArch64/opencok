import { describe, expect, test } from "vitest";
import fc from "fast-check";
import { kingdomDatabase } from "../../src/factories/kingdom-database";
import { worldCellValidator } from "../../src/validators/world-cell";
import { pageQueryValidator, publicIdValidator } from "../../src/validators/repository";

const options = { seed: 7463, numRuns: 500 };

describe("persistence boundary properties", () => {
    test("every positive SQL integer maps injectively to its kingdom name", () => {
        fc.assert(
            fc.property(
                fc.integer({ min: 1, max: 2_147_483_647 }),
                fc.integer({ min: 1, max: 2_147_483_647 }),
                (left, right) => {
                    expect(kingdomDatabase(left)).toBe(`kingdom_${left}`);
                    expect(kingdomDatabase(left) === kingdomDatabase(right)).toBe(left === right);
                },
            ),
            options,
        );
    });

    test("all representable numbers outside the kingdom domain are rejected", () => {
        fc.assert(
            fc.property(
                fc.double().filter(value =>
                    !Number.isInteger(value) || value < 1 || value > 2_147_483_647
                ),
                value => {
                    expect(() => kingdomDatabase(value)).toThrow(RangeError);
                },
            ),
            options,
        );
    });

    test("world cells accept exactly the integer rectangle, not just a sample of its edges", () => {
        fc.assert(
            fc.property(
                fc.integer({ min: -1200, max: 2400 }),
                fc.integer({ min: -1200, max: 2400 }),
                (columnIndex, rowIndex) => {
                    const input = { columnIndex, rowIndex };
                    const expected = columnIndex >= 0 && columnIndex < 1200
                        && rowIndex >= 0 && rowIndex < 1200;
                    const result = worldCellValidator.safeParse(input);
                    expect(result.success).toBe(expected);
                    if (result.success)
                    {
                        expect(result.data).toEqual(input);
                    }
                },
            ),
            options,
        );
    });

    test("all valid cells round-trip without mutation", () => {
        fc.assert(
            fc.property(
                fc.record({
                    columnIndex: fc.integer({ min: 0, max: 1199 }),
                    rowIndex: fc.integer({ min: 0, max: 1199 }),
                }),
                input => {
                    const result = worldCellValidator.parse(input);
                    expect(result).toEqual(input);
                    expect(result).not.toBe(input);
                },
            ),
            options,
        );
    });

    test("valid page queries preserve exact offset and limit", () => {
        fc.assert(
            fc.property(
                fc.integer({ min: 0, max: 2_147_483_647 }),
                fc.integer({ min: 1, max: 200 }),
                (offset, limit) => {
                    expect(pageQueryValidator.parse({ offset, limit })).toEqual({ offset, limit });
                },
            ),
            options,
        );
    });

    test("UUID casing normalizes idempotently without changing identity", () => {
        fc.assert(
            fc.property(fc.uuid(), publicId => {
                const normalized = publicIdValidator.parse(publicId.toUpperCase());
                expect(normalized).toBe(publicId.toLowerCase());
                expect(publicIdValidator.parse(normalized)).toBe(normalized);
            }),
            options,
        );
    });
});
