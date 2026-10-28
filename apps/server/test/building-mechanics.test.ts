import { expect, test } from "bun:test";
import { createBuildingCatalog } from "@opencok/resources/buildings";
import { buildingLevel, nextBuildingLevel } from "@opencok/rules/building";
import type { BuildingLevelDefinition } from "@opencok/contracts/building";
import { Rules } from "@opencok/rules/game";
import { building } from "@opencok/mappings/city";
import { reconnectResourceOutput } from "@opencok/rules/reconnect-task-counts";
import { Type } from "@opencok/messages/sfs";

test("editing typed costs changes the mobile response while keeping realm catalogs independent", () => {
    const first = createBuildingCatalog();
    const second = createBuildingCatalog();
    const original = first.get(400001);
    if (!original)
    {
        throw new Error("Missing castle definition");
    }
    expect(original.requiredBuildings).toEqual([{ buildingId: 419000, level: 1 }]);
    first.set(400001, { ...original, costs: { ...original.costs, wood: 9007199254740993n } });
    const rules = new Rules(first, new Map(), new Map());
    const result = building({ itemId: "400000", level: 1 }, rules, false, 0);
    expect(result.wood).toEqual({ type: Type.Long, value: 9007199254740993n });
    expect(result.time?.value).toBe(3);
    expect(second.get(400001)?.costs?.wood).toBe(2800n);
});

test("star upgrades use next costs and duration but completed power and effects", () => {
    const current: BuildingLevelDefinition = {
        id: 413030,
        buildingId: 413000,
        level: 30,
        starLevel: 0,
        power: 5,
        effects: { productionResourceId: 0 },
        effectSteps: {
            productionPerHour: [
                { progress: 0, value: 100 },
                { progress: 10, value: 200 },
            ],
        },
        upgrades: {
            constructionSeconds: [
                { progress: 10, value: 20 },
                { progress: 100, value: 30 },
            ],
            costs: [
                { progress: 10, value: { wood: 20n } },
                { progress: 100, value: { wood: 30n } },
            ],
            power: [
                { progress: 0, value: 5 },
                { progress: 10, value: 6 },
            ],
        },
    };
    const definitions = new Map([
        [current.id, current],
        [413031, { ...current, id: 413031, starLevel: 1 }],
    ]);
    const initial = buildingLevel(definitions, "413000", 30, 0, 0);
    expect(initial.costs?.wood).toBe(20n);
    expect(initial.constructionSeconds).toBe(20);
    expect(initial.power).toBe(5);
    expect(initial.effects?.productionPerHour).toBe(100);
    const progressed = buildingLevel(definitions, "413000", 30, 0, 10);
    expect(progressed.costs?.wood).toBe(30n);
    expect(progressed.constructionSeconds).toBe(30);
    expect(progressed.power).toBe(6);
    expect(progressed.effects?.productionPerHour).toBe(200);
    expect(nextBuildingLevel(definitions, "413000", 30, 0, 10, 1).starLevel).toBe(1);
    const rules = new Rules(definitions, new Map(), new Map());
    expect(
        reconnectResourceOutput([{ itemId: 413000, level: 30, star: 0, progress: 10 }], rules).get(
            0,
        ),
    ).toBe(200);
    expect(current.effects?.productionPerHour).toBeUndefined();
});
