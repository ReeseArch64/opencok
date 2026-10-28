export interface DragonTowerLayerDefinition
{
    readonly "id": number;
    readonly "level": number;
    readonly "easyMonster": readonly number[];
    readonly "easyFirstReward"?: number;
    readonly "easyReward": number;
    readonly "easyLayerReward": number;
    readonly "easyScore": number;
    readonly "mediumMonster": readonly number[];
    readonly "mediumFirstReward": number;
    readonly "mediumReward": number;
    readonly "mediumLayerReward": number;
    readonly "mediumScore": number;
    readonly "hardMonster": readonly number[];
    readonly "hardFirstReward": number;
    readonly "hardReward": number;
    readonly "hardLayerReward": number;
    readonly "hardScore": number;
    readonly "heal": number | string;
    readonly "buff"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type DragonTowerLayerDefinitionCatalog = CatalogTable<DragonTowerLayerDefinition>;
