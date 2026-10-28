export interface SpLoadDefinition
{
    readonly "id": number;
    readonly "load": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type SpLoadDefinitionCatalog = CatalogTable<SpLoadDefinition>;
