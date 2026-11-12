import { describe, expect, test } from "bun:test";
import {
    cacheTtlValidator,
    internalIdValidator,
    pageQueryValidator,
    publicIdValidator,
} from "./repository";

const publicId = "b6f84dc5-cd4e-47cc-a3c7-82a67c0c84bd";

describe("repository boundaries", () => {
    test("normalizes only valid UUIDs", () => {
        expect(publicIdValidator.parse(publicId.toUpperCase())).toBe(publicId);
        for (const value of ["", "1", ` ${publicId}`, `${publicId} `, null])
        {
            expect(publicIdValidator.safeParse(value).success).toBe(false);
        }
    });

    test("pagination defaults and edges preserve an explicit bounded query", () => {
        expect(pageQueryValidator.parse({})).toEqual({ offset: 0, limit: 50 });
        expect(pageQueryValidator.parse({ offset: 2_147_483_647, limit: 200 })).toEqual({
            offset: 2_147_483_647,
            limit: 200,
        });
        for (
            const input of [
                { offset: -1 },
                { offset: 0.5 },
                { offset: 2_147_483_648 },
                { limit: 0 },
                { limit: 201 },
                { limit: 1.5 },
                { limit: "1" },
                { cursor: "ignored" },
            ]
        )
        {
            expect(pageQueryValidator.safeParse(input).success).toBe(false);
        }
    });

    test("internal identifiers and TTLs fit positive signed SQL integers", () => {
        for (const validator of [internalIdValidator, cacheTtlValidator])
        {
            expect(validator.parse(1)).toBe(1);
            expect(validator.parse(2_147_483_647)).toBe(2_147_483_647);
            for (const value of [0, -1, 0.5, 2_147_483_648, Infinity, NaN, "1", null])
            {
                expect(validator.safeParse(value).success).toBe(false);
            }
        }
    });
});
