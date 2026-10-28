import { expect, test } from "bun:test";
import {
    inventoryCount,
    inventoryPairs,
    inventoryPrice,
    inventoryRecipe,
    inventoryWeighted,
} from "@opencok/rules/inventory";

test("catalog prices distinguish bundles, fallback, batch and material costs without overflow", () => {
    const rule = { price: "10", sales: "2;15|5;30" };
    expect(inventoryPrice(rule, 2, false)).toEqual({ count: 2, price: 15 });
    expect(inventoryPrice(rule, 3, false)).toEqual({ count: 1, price: 10 });
    expect(inventoryPrice(rule, 2, true)).toEqual({ count: 2, price: 20 });
    expect(inventoryPrice({ type: "7", make: "1|2|30" }, 2, false)).toEqual({
        count: 2,
        price: 60,
    });
    for (const value of [0, -1, 1.5, NaN, Infinity, 2147483648, "1", null])
    {
        expect(() => inventoryCount(value)).toThrow();
    }
    expect(() => inventoryPrice({ price: "2147483647" }, 2, true)).toThrow();
    expect(() => inventoryPrice({ price: "0" }, 1, false)).toThrow();
});

test("recipes select alternatives, enforce every simultaneous cost and reject malformed catalogs", () => {
    const rule = { type: "13", para1: "100\\200", para2: "10;11\\10|12", para3: "3;5\\7|9" };
    expect(inventoryRecipe(rule, "10", "100", 2)).toEqual({
        costs: new Map([["10", 6]]),
        rewards: new Map([["100", 1]]),
    });
    expect(inventoryRecipe(rule, "10", "200", 2).costs).toEqual(
        new Map([
            ["10", 14],
            ["12", 18],
        ]),
    );
    expect(() => inventoryRecipe(rule, "99", "100", 1)).toThrow();
    expect(() => inventoryRecipe(rule, "10", "999", 1)).toThrow();
    expect(() => inventoryRecipe({ ...rule, para3: "1" }, "10", "100", 1)).toThrow();
    expect(() => inventoryRecipe(rule, "10", "200", 2147483647)).toThrow();
    for (const text of ["", "1;-1", "1;0", "1;2|1;3", "1;2;3", "x;1"])
    {
        expect(() => inventoryPairs(text)).toThrow();
    }
});

test("weighted outcomes cover every boundary exactly and reject invalid random sources", () => {
    const weights = new Map([
        ["100", 2],
        ["200", 3],
        ["300", 1],
    ]);
    expect(Array.from({ length: 6 }, (_, value) => inventoryWeighted(weights, () => value)))
        .toEqual([
            "100",
            "100",
            "200",
            "200",
            "200",
            "300",
        ]);
    for (const value of [-1, 6, 0.5, NaN])
    {
        expect(() => inventoryWeighted(weights, () => value)).toThrow();
    }
    expect(() => inventoryWeighted(new Map())).toThrow();
    expect(() =>
        inventoryWeighted(
            new Map([
                ["1", 2147483647],
                ["2", 1],
            ]),
        )
    ).toThrow();
});
