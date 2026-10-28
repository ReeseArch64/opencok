export interface GeneralCalledTaskDefinition
{
    readonly "id": number;
    readonly "desc": number;
    readonly "goType": number;
    readonly "goItemId": number;
    readonly "tab": number;
}

import type { CatalogTable } from "@opencok/resources/catalog-model";

export type GeneralCalledTaskDefinitionCatalog = CatalogTable<GeneralCalledTaskDefinition>;
