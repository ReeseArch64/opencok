import { describe, expect, test } from "bun:test";
import { worldCellValidator } from "./world-cell";

describe("world cell validation", () => {
    test.each([
        { columnIndex: 0, rowIndex: 0 },
        { columnIndex: 1199, rowIndex: 1199 },
        { columnIndex: 0, rowIndex: 1199 },
        { columnIndex: 1199, rowIndex: 0 },
    ])("accepts world edges %j", cell => {
        expect(worldCellValidator.parse(cell)).toEqual(cell);
    });

    test.each(["columnIndex", "rowIndex"] as const)("enforces %s independently", field => {
        for (const value of [-1, 1200, 0.5, NaN, Infinity, "1", null, undefined])
        {
            expect(
                worldCellValidator.safeParse({ columnIndex: 1, rowIndex: 1, [field]: value })
                    .success,
            ).toBe(false);
        }
    });

    test.each([
        null,
        [],
        {},
        { columnIndex: 1 },
        { rowIndex: 1 },
        { columnIndex: 1, rowIndex: 1, x: 1 },
    ].map(cell => ({ cell })))("rejects incomplete or ambiguous cell %j", ({ cell }) => {
        expect(worldCellValidator.safeParse(cell).success).toBe(false);
    });
});
