export interface PlayerDataDefinition
{
    readonly "id": number;
    readonly "stronghold": number;
    readonly "playerLv": number;
    readonly "wood": bigint;
    readonly "food": bigint;
    readonly "troops": readonly (readonly number[])[];
    readonly "loggingcamp1": number;
    readonly "loggingcamp2": number;
    readonly "loggingcamp3": number;
    readonly "loggingcamp4": number;
    readonly "loggingcamp5": number;
    readonly "loggingcamp6": number;
    readonly "farm1": number;
    readonly "farm2": number;
    readonly "farm3": number;
    readonly "farm4": number;
    readonly "farm5": number;
    readonly "farm6": number;
    readonly "power": number;
    readonly "status": number;
    readonly "ability": number;
    readonly "skill2": number;
    readonly "point": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type PlayerDataDefinitionCatalog = CatalogTable<PlayerDataDefinition>;
