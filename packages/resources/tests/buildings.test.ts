import { expect, test } from "bun:test";
import {
    BUILDING_LEVELS,
    createBuildingCatalog,
    getBuildingDefinition,
} from "../src/buildings/index.ts";

test("building data exposes numeric identities and named values without XML nodes", () => {
    expect(BUILDING_LEVELS).toHaveLength(1511);
    expect(getBuildingDefinition(413000)).toMatchObject({
        id: 413000,
        levelMax: 30,
        resourceId: 0,
    });
    expect(getBuildingDefinition(999999)).toBeUndefined();
    expect(new Set(BUILDING_LEVELS.map((definition) => definition.buildingId)).size).toBe(41);
    for (const definition of BUILDING_LEVELS)
    {
        expect(Number.isSafeInteger(definition.id)).toBe(true);
        expect(Number.isInteger(definition.level)).toBe(true);
        expect(Object.keys(definition)).not.toContain(":@");
        expect(Object.keys(definition)).not.toContain("ItemSpec");
        for (const amount of Object.values(definition.costs ?? {}))
        {
            expect(typeof amount).toBe("bigint");
            expect(amount).toBeGreaterThanOrEqual(0n);
        }
    }
});

test("building catalogs isolate nested costs and progression across realms", () => {
    const first = createBuildingCatalog();
    const second = createBuildingCatalog();
    const castle = first.get(400001)!;
    first.set(castle.id, { ...castle, costs: { wood: 9007199254740993n } });
    expect(first.get(castle.id)?.costs?.wood).toBe(9007199254740993n);
    expect(second.get(castle.id)?.costs?.wood).toBe(2800n);
    expect(first.get(413030)?.effectSteps).not.toBe(second.get(413030)?.effectSteps);
});
