export interface BocaiDragonDefinition
{
    readonly "id": number;
    readonly "type": number;
    readonly "reward": number;
    readonly "rate": number;
    readonly "color": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type BocaiDragonDefinitionCatalog = CatalogTable<BocaiDragonDefinition>;
