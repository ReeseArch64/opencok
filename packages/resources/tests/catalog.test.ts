import { expect, test } from "bun:test";
import { GameplayCatalog } from "@opencok/enums/gameplay-catalog";
import { catalogDefinitions, loadCatalog } from "../src/catalog-definitions.ts";
import { loadRules } from "../src/rules.ts";
import { isCosmeticStatus } from "@opencok/rules/city-cosmetics";

test("bundled rules load for both realms and isolate mutable indexes", async () => {
    const first = await loadRules(undefined, 1);
    const second = await loadRules(undefined, 2);
    expect(first.kingdomId).toBe(1);
    expect(second.kingdomId).toBe(2);
    expect(first.buildings.size).toBeGreaterThan(0);
    const key = [...first.buildings.keys()][0];
    if (!key)
    {
        throw new Error("Missing bundled building ID");
    }
    const original = second.buildings.get(key);
    if (!original)
    {
        throw new Error("Missing building definition");
    }
    first.buildings.set(key, {
        ...original,
        constructionSeconds: (original.constructionSeconds ?? 0) + 1,
    });
    expect(second.buildings.get(key)).toEqual(original);
    expect(second.buildings.get(key)).not.toEqual(first.buildings.get(key));
});

test("loadRules_bundledSkins_disablesAttributeAndAbilityDeclarationsOnEveryRestart", async () => {
    const first = await loadRules();
    const restarted = await loadRules();
    const skins = [...first.power.statuses!.values()].filter(isCosmeticStatus);

    expect(skins.length).toBeGreaterThan(100);
    expect(
        skins.every((rule) =>
            !rule.effect || rule.effect.split("|").every((pair) => pair.startsWith("14;"))
        ),
    )
        .toBe(true);
    expect(
        skins.every((rule) =>
            !rule.effectAdd && !rule.effect_add && !rule.skill && rule.random === "0"
        ),
    ).toBe(true);
    expect(restarted.power.statuses).toEqual(first.power.statuses);
    expect(first.power.statuses!.get("510152")!.effect).toBe("2189;1");
    expect(first.power.statuses!.get("12000080")!.effect).toBe("");
});

test("changing typed item pricing reaches server rules without an XML conversion", async () => {
    const { spyOn } = await import("bun:test");
    const { loadRules } = await import("../src/rules.ts");
    const { inventoryPrice } = await import("@opencok/economy/rules/inventory");
    const goods = await loadCatalog(GameplayCatalog.Goods);
    const originalPrice = goods.records.find((record) => record.id === 200001)?.price;
    const edited = {
        ...goods,
        records: goods.records.map((record) =>
            record.id === 200001 ? { ...record, price: 123n } : record
        ),
    };
    const factory = spyOn(catalogDefinitions, GameplayCatalog.Goods).mockResolvedValue(edited);
    try
    {
        const rules = await loadRules();
        const rule = rules.goods.get("200001")!;
        expect(inventoryPrice(rule, 2, true)).toMatchObject({ count: 2, price: 246 });
        expect(goods.records.find((record) => record.id === 200001)?.price).toBe(originalPrice);
    }
    finally
    {
        factory.mockRestore();
    }
});
