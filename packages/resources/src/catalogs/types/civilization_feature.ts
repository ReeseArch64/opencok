export interface CivilizationFeatureDefinition
{
    readonly "id": number;
    readonly "type": number;
    readonly "reputationLevel": number;
    readonly "effect": readonly number[];
    readonly "effectIcon": number | string;
    readonly "effectDialog": number;
    readonly "dialog": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type CivilizationFeatureDefinitionCatalog = CatalogTable<CivilizationFeatureDefinition>;
