export interface EffectRequirementDefinition
{
    readonly "id": number;
    readonly "eventStateId": number | readonly number[];
    readonly "effect": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type EffectRequirementDefinitionCatalog = CatalogTable<EffectRequirementDefinition>;
