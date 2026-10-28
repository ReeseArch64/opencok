export interface QuickBuildingDefinition
{
    readonly "id": number;
    readonly "groupid": number;
    readonly "buildingid": number;
    readonly "Targetlv": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type QuickBuildingDefinitionCatalog = CatalogTable<QuickBuildingDefinition>;
