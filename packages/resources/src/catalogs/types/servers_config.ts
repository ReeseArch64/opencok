export interface ServersConfigDefinition
{
    readonly "id": string;
    readonly "level"?: number;
    readonly "prestige"?: number;
    readonly "enabled"?: number;
    readonly "unlockAll"?: number;
    readonly "levelMax"?: number;
    readonly "maxStar"?: number;
    readonly "maxPower"?: number;
    readonly "gmBypass"?: number;
    readonly "rankingHideGm"?: number;
    readonly "attackPercent"?: number;
    readonly "attackWins"?: number;
    readonly "defenceWins"?: number;
    readonly "UnitHP"?: number;
    readonly "honorPoint"?: number;
    readonly "kill"?: number;
    readonly "militaryPoint"?: number;
    readonly "power"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type ServersConfigDefinitionCatalog = CatalogTable<ServersConfigDefinition>;
