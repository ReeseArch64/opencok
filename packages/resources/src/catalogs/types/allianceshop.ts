export interface AllianceshopDefinition
{
    readonly "id": number;
    readonly "item": number;
    readonly "type": number;
    readonly "contribution": number;
    readonly "funds": number;
    readonly "time": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type AllianceshopDefinitionCatalog = CatalogTable<AllianceshopDefinition>;
