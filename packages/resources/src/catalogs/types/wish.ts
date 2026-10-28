export interface WishDefinition
{
    readonly "id": number;
    readonly "dialog": number | readonly number[];
    readonly "rewards": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type WishDefinitionCatalog = CatalogTable<WishDefinition>;
