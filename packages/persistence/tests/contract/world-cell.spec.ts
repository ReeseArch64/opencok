import { describe, expect, test } from "vitest";
import { worldCellValidator } from "../../src/validators/world-cell";

describe("world cell wire contract", () => {
    test.each([
        { columnIndex: 0, rowIndex: 0 },
        { columnIndex: 1199, rowIndex: 1199 },
        { columnIndex: 0, rowIndex: 1199 },
        { columnIndex: 1199, rowIndex: 0 },
    ])("retains coordinate names and inclusive bounds %j", input => {
        expect(worldCellValidator.parse(input)).toEqual(input);
    });

    test.each(["columnIndex", "rowIndex"] as const)("bounds %s without coercion", field => {
        for (
            const invalid of [-1, 1200, -0.5, 0.5, 1199.5, NaN, Infinity, "0", null, undefined]
        )
        {
            const result = worldCellValidator.safeParse({
                columnIndex: 1,
                rowIndex: 1,
                [field]: invalid,
            });
            expect(result.success).toBe(false);
            if (!result.success)
            {
                expect(result.error.issues.map(issue => issue.path)).toContainEqual([field]);
            }
        }
    });

    test.each([
        null,
        [],
        {},
        { columnIndex: 0 },
        { rowIndex: 0 },
        { x: 0, y: 0 },
        { columnIndex: 0, rowIndex: 0, extra: true },
    ].map(input => ({ input })))("rejects incomplete or ambiguous coordinates %j", ({ input }) => {
        expect(worldCellValidator.safeParse(input).success).toBe(false);
    });
});
