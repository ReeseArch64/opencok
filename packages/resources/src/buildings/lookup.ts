import type { BuildingDefinition } from "@opencok/contracts/building";
import { BUILDING_LEVELS } from "./levels.ts";

export function getBuildingDefinition(id: number): BuildingDefinition | undefined
{
    const levels = BUILDING_LEVELS.filter((definition) => definition.buildingId === id);

    if (!levels.length)
    {
        return undefined;
    }

    return {
        id,
        levelMax: Math.max(...levels.map((definition) => definition.level)),
        resourceId: levels.find((definition) =>
            definition.effects?.productionResourceId !== undefined
        )
            ?.effects?.productionResourceId,
        levels,
    };
}
