import { expect, test } from "bun:test";
import { GameError } from "@opencok/errors/game";
import { buildingLevel, buildingStep, nextBuildingLevel } from "../src/rules/levels";
import { createBuildingCatalog } from "../src/resources/buildings/levels";
import { importBuildingDefinition } from "../src/mappings/legacy-definition";
import {
    buildingDisplayParameters,
    buildingItemCosts,
    buildingRequirements,
    buildingUnlockValues,
} from "../src/mappings/display";

test("building levels reject malformed identities, progress and missing definitions", () => {
    const catalog = createBuildingCatalog();

    for (
        const [itemId, level, star, progress] of [
            ["bad", 1, 0, 0],
            ["400000", -1, 0, 0],
            ["400000", 31, 0, 0],
            ["400000", 1.5, 0, 0],
            ["400000", 1, 1, 0],
            ["400000", 30, -1, 0],
            ["400000", 30, 0, -1],
            ["400000", 30, 0, 100],
            ["999999", 1, 0, 0],
        ] as const
    )
    {
        expect(() => buildingLevel(catalog, itemId, level, star, progress)).toThrow(GameError);
    }
});

test("star thresholds preserve completed effects, next costs and the configured maximum", () => {
    const steps = [{ progress: 10, value: 0 }, { progress: 100, value: 7 }];
    expect(buildingStep(undefined, 0)).toBeUndefined();
    expect(buildingStep(steps, 0)).toBeUndefined();
    expect(buildingStep(steps, 0, true)?.value).toBe(0);
    expect(buildingStep(steps, 10)?.value).toBe(0);
    expect(buildingStep(steps, 10, true)?.value).toBe(7);
    expect(buildingStep(steps, 100, true)).toBeUndefined();
    const catalog = createBuildingCatalog();
    expect(nextBuildingLevel(catalog, "400000", 1, 0, 0, 0).level).toBe(2);
    expect(nextBuildingLevel(catalog, "400000", 30, 0, 0, 0))
        .toEqual(buildingLevel(catalog, "400000", 30, 0, 0));
});

test("legacy building records preserve bigint costs and exact display and requirement order", () => {
    const definition = importBuildingDefinition({
        id: "413030",
        level: "30",
        wood: "9007199254740993",
        para1: "0;0|10;5",
        para2: "0;100|10;200",
    });
    const state = buildingLevel(new Map([[definition.id, definition]]), "413000", 30, 0, 10);
    expect(state.costs?.wood).toBe(9007199254740993n);
    expect(state.effects?.productionPerHour).toBe(5);
    expect(buildingDisplayParameters(state)).toEqual([
        "5",
        "200",
        undefined,
        undefined,
        undefined,
        undefined,
    ]);
    const requirements = {
        ...state,
        requiredBuildings: [{ buildingId: 419000, level: 1 }, { buildingId: 400000, level: 30 }],
        requiredItems: [{ itemId: 1 }, { itemId: 2, quantity: 0n }, {
            itemId: 3,
            quantity: 9007199254740993n,
        }],
        unlockConditions: [{ code: 2, value: 0 }, { code: 3 }],
    };
    expect(buildingRequirements(requirements)).toBe("419000;1|400000;30");
    expect(buildingItemCosts(requirements)).toBe("1|2;0|3;9007199254740993");
    expect(buildingUnlockValues(requirements)).toEqual({ types: "2;3", values: "0;" });
});
