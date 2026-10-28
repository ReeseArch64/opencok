export interface ResourcesDefinition
{
    readonly "id": number;
    readonly "areaLevel": number;
    readonly "ratio": number;
    readonly "resType": number;
    readonly "resLevel": number;
    readonly "hours": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type ResourcesDefinitionCatalog = CatalogTable<ResourcesDefinition>;
