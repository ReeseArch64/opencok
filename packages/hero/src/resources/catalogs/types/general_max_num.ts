export interface GeneralMaxNumDefinition
{
    readonly "id": number;
    readonly "generalId": number;
    readonly "consume": readonly number[];
    readonly "maxNum": number;
}

import type { CatalogTable } from "@opencok/resources/catalog-model";

export type GeneralMaxNumDefinitionCatalog = CatalogTable<GeneralMaxNumDefinition>;
