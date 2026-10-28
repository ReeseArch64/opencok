export interface AllianceQuestDefinition
{
    readonly "id": number;
    readonly "color": number;
    readonly "publishBaseReward": string;
    readonly "acceptReward": string;
    readonly "rollRate": number;
    readonly "systemRate": number;
    readonly "publishTimer": number;
    readonly "finishTimer": number;
    readonly "cost": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type AllianceQuestDefinitionCatalog = CatalogTable<AllianceQuestDefinition>;
