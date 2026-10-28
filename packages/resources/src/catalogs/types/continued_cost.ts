export interface ContinuedCostDefinition
{
    readonly "id": number;
    readonly "type": number;
    readonly "level": number;
    readonly "point": number;
    readonly "item": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type ContinuedCostDefinitionCatalog = CatalogTable<ContinuedCostDefinition>;
