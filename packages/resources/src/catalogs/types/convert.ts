export interface ConvertDefinition
{
    readonly "id": number;
    readonly "reward": readonly number[];
    readonly "count": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type ConvertDefinitionCatalog = CatalogTable<ConvertDefinition>;
