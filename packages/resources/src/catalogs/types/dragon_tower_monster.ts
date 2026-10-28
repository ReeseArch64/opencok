export interface DragonTowerMonsterDefinition
{
    readonly "id": number;
    readonly "army": readonly (readonly number[])[];
    readonly "buff": readonly (readonly number[])[];
    readonly "weight": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type DragonTowerMonsterDefinitionCatalog = CatalogTable<DragonTowerMonsterDefinition>;
