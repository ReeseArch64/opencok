export interface ReputationLevelDefinition
{
    readonly "id": number;
    readonly "icon": string;
    readonly "dialog": number;
    readonly "reputationLevel": number;
    readonly "reputationPoint": readonly number[];
    readonly "limit": number;
    readonly "reputationGroup": number;
    readonly "actionLimit": number;
    readonly "value"?: number;
    readonly "levelAwardMail"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type ReputationLevelDefinitionCatalog = CatalogTable<ReputationLevelDefinition>;
