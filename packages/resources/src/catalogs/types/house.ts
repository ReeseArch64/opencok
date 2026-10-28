export interface HouseDefinition
{
    readonly "id": number;
    readonly "army": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type HouseDefinitionCatalog = CatalogTable<HouseDefinition>;
