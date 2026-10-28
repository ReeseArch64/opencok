export interface Catalog3thAnniversaryDefinition
{
    readonly "id": number;
    readonly "master": number;
    readonly "parent": number;
    readonly "value"?: string;
    readonly "valueMax"?: string;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type Catalog3thAnniversaryDefinitionCatalog = CatalogTable<Catalog3thAnniversaryDefinition>;
