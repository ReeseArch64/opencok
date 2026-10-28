export interface GeoTreasureTaskDefinition
{
    readonly "id": number;
    readonly "taskDialog": number;
    readonly "taskDialogNum": number;
    readonly "index": number;
    readonly "taskGoType": number;
    readonly "taskGo": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type GeoTreasureTaskDefinitionCatalog = CatalogTable<GeoTreasureTaskDefinition>;
