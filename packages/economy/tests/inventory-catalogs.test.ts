import { expect, test } from "bun:test";
import { GameError } from "@opencok/errors/game";
import type { InventoryCatalogs } from "../src/contracts/inventory-catalogs.ts";
import { inventoryGoods } from "../src/rules/inventory.ts";

test("inventory catalogs preserve native string identities and return the existing row", () => {
    const padded = { price: "12" };
    const ordinary = { price: "34" };
    const catalogs: InventoryCatalogs = {
        goods: new Map([
            ["001", padded],
            ["1", ordinary],
            ["invalid", { price: "56" }],
        ]),
    };

    expect(inventoryGoods(catalogs, "001")).toBe(padded);
    expect(inventoryGoods(catalogs, "1")).toBe(ordinary);

    for (const id of ["", "2", "invalid", " 1", "-1", "1.0"])
    {
        expect(() => inventoryGoods(catalogs, id)).toThrow(new GameError("E100166"));
    }

    expect(catalogs.goods.size).toBe(3);
});
