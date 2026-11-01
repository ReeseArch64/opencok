import { expect, test } from "bun:test";
import { GameplayCatalog } from "@opencok/enums/gameplay-catalog";
import { CatalogKind, VariableScope } from "@opencok/enums/catalog-kind";
import { catalogDefinitions, loadCatalog } from "../src/catalog-definitions.ts";
import { definitionIndex, mapTile } from "../src/catalog-model.ts";
import {
    initialVariables,
    roleLevelRewards,
    rulesForEvent,
    withMapTile,
} from "../src/catalog-mechanics.ts";
import provenance from "../src/catalogs/provenance.json";

const appearanceAdditions: Readonly<Record<string, number>> = {
    [GameplayCatalog.Goods]: 385,
    [GameplayCatalog.Status]: 603,
    [GameplayCatalog.ShopNew]: 1037,
};

const maintainedAdditions: Readonly<Record<string, readonly number[]>> = {
    [GameplayCatalog.GeneralAb]: [41020011, 53571201, 53571202],
    [GameplayCatalog.GeneralSkill]: [
        53571100,
        53571101,
        53571102,
        53571103,
        53571104,
        53571105,
        53571106,
        53571107,
        53571108,
        53571109,
        53571110,
        53571111,
        53571112,
        53571113,
        53571114,
        53571115,
        53571116,
        53571117,
        53571118,
        53571119,
        53571120,
        53571121,
        53571122,
        53571123,
        53571124,
        53571125,
        53571126,
        53571127,
        53571128,
        53571129,
        53571130,
        53571131,
        53571132,
        53571133,
        53571134,
        53571135,
        53571136,
        53571137,
        53571138,
        53571139,
        53571140,
        53571141,
        53571142,
        53571143,
        53571144,
        53571145,
        53571146,
        53571147,
        53571148,
        53571149,
        53571150,
        53571151,
        53571152,
        53571153,
        53571154,
        53571155,
        53571156,
        53571157,
        53571158,
        53571159,
    ],
};

test("all remaining catalogs expose domain definitions without XML documents", async () => {
    expect(
        Object.values(GameplayCatalog)
            .filter((id) => id !== GameplayCatalog.Building)
            .map(String)
            .sort(),
    ).toEqual(provenance.map((source) => source.id).sort());
    const verified = new Set<string>();
    for (const source of provenance)
    {
        const factory = catalogDefinitions[source.id as keyof typeof catalogDefinitions];
        expect(typeof factory).toBe("function");
        if (verified.has(source.module))
        {
            continue;
        }
        const catalog = await factory();
        expect(String(catalog.kind)).toBe(source.kind);
        expect(Object.keys(catalog)).not.toContain("ordered");
        expect(Object.keys(catalog)).not.toContain("unordered");
        if (catalog.kind === CatalogKind.Table)
        {
            const additions = maintainedAdditions[source.id] ?? [];
            expect(catalog.records.length).toBe(
                source.records! + additions.length + (appearanceAdditions[source.id] ?? 0),
            );
            for (const id of additions)
            {
                expect(catalog.records.filter((record) => "id" in record && record.id === id))
                    .toHaveLength(
                        1,
                    );
            }
            for (const record of catalog.records)
            {
                const keys = Object.keys(record);
                expect(keys).not.toContain(":@");
                expect(keys).not.toContain("ItemSpec");
                expect(keys).not.toContain("#text");
            }
        }
        else if (catalog.kind === CatalogKind.TileMap)
        {
            for (const layer of catalog.layers)
            {
                expect(layer.tiles).toHaveLength(layer.width * layer.height);
                expect(layer.tiles.every((tile) => Number.isSafeInteger(tile) && tile >= 0)).toBe(
                    true,
                );
            }
        }
        verified.add(source.module);
        Bun.gc(true);
    }
}, 180000);

test("numeric role mechanics expose typed rewards and preserve numeric resource IDs", async () => {
    const roles = await loadCatalog(GameplayCatalog.Role);
    const role = definitionIndex(roles).get("100101")!;
    expect(role.id).toBe(100101);
    expect(typeof role.playerExperience).toBe("number");
    expect(roleLevelRewards({ ...role, levelItem: [211266], levelNum: [3] })[0]).toEqual({
        itemId: 211266,
        quantity: 3,
    });
    const cloned = structuredClone(roles);
    const changed = {
        ...cloned,
        records: [{ ...role, playerExperience: 999 }, ...cloned.records.slice(1)],
    };
    expect(changed.records[0]!.playerExperience).toBe(999);
    expect(typeof role.playerExperience).toBe("number");
});

test("map edits address coordinates directly and keep the source map isolated", async () => {
    const map = await loadCatalog(GameplayCatalog.ArenaMap);
    const before = mapTile(map, 0, 0, 0);
    const changed = withMapTile(map, 0, 0, 0, 999999);
    expect(mapTile(changed, 0, 0, 0)).toBe(999999);
    expect(mapTile(map, 0, 0, 0)).toBe(before);
    expect(() => mapTile(map, 0, -1, 0)).toThrow("Tile coordinate");
    expect(() => withMapTile(map, 0, 0, 0, -1)).toThrow("Invalid tile");
});

test("automation exposes typed events, actions and scoped initial values", async () => {
    const triggers = await loadCatalog(GameplayCatalog.Trigger);
    const selected = rulesForEvent(triggers, 8);
    expect(selected.length).toBeGreaterThan(0);
    expect(selected.every((rule) => rule.events.some((event) => event.code === 8))).toBe(true);
    const variables = await loadCatalog(GameplayCatalog.TriggerVar);
    const values = initialVariables(variables, VariableScope.P);
    expect(values.get("long_3th_anniversary")).toBe(0);
});

test("status definitions retain declarations without IDs outside their index", async () => {
    const statuses = await loadCatalog(GameplayCatalog.Status);
    expect(
        statuses.records.filter((record) => record.id === undefined || !String(record.id).trim()),
    ).toHaveLength(14);
    expect(definitionIndex(statuses).has("")).toBe(false);
});
