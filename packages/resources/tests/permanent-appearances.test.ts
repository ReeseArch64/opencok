import { expect, test } from "bun:test";
import { catalog as statuses } from "../src/catalogs/data/status";
import { catalog as goods } from "../src/catalogs/data/goods";
import { catalog as offers } from "../src/catalogs/data/shop_new";
import bindings from "./fixtures/appearance-catalog.json";
import { permanentAppearanceStatuses } from "../src/catalogs/permanent-appearances";

test("every published catalog skin and its duration variants are permanent", () => {
    const indexed = new Map(statuses.records.map((row) => [String(row.id), row]));
    for (const skin of bindings.filter((row) => row.enabled))
    {
        const selected = indexed.get(skin.statusId)!;
        expect(selected).toBeDefined();
        expect(selected.isForever).toBe(1);
        expect(selected.time).toBeUndefined();
        expect(selected.autoend).toBeUndefined();
        const variants = statuses.records.filter((row) =>
            row.type2 === selected.type2 && row.subgroup === selected.subgroup
        );
        expect(
            variants.every((row) =>
                row.isForever === 1 && row.time === undefined && row.autoend === undefined
            ),
        ).toBe(true);
    }
});

test("permanence preserves item bindings, offer prices and unrelated timed effects", () => {
    const beforeGoods = structuredClone(goods.records);
    const beforeOffers = structuredClone(offers.records);
    const result = permanentAppearanceStatuses(
        [
            { id: 1, type2: 100, subgroup: 1, time: 259200, autoend: 30 },
            { id: 2, type2: 100, subgroup: 1, time: 604800 },
            { id: 3, type2: 100, subgroup: 1, time: 2592000 },
            { id: 4, type2: 1, time: 60 },
            { id: 5, type2: 200, overlap: 5, time: 120 },
        ],
        [{ id: 10, type: 4, para1: 1 }],
        [{ ...offers.records[0]!, itemId: 10 }],
    );
    expect(result.slice(0, 3)).toEqual([
        { id: 1, type2: 100, subgroup: 1, isForever: 1 },
        { id: 2, type2: 100, subgroup: 1, isForever: 1 },
        { id: 3, type2: 100, subgroup: 1, isForever: 1 },
    ]);
    expect(result[3]).toEqual({ id: 4, type2: 1, time: 60 });
    expect(result[4]).toEqual({ id: 5, type2: 200, overlap: 5, time: 120 });
    expect(goods.records).toEqual(beforeGoods);
    expect(offers.records).toEqual(beforeOffers);
});
