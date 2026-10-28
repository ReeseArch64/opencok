export interface AttributeRandomDefinition
{
    readonly "id": number;
    readonly "effect": number | readonly number[];
    readonly "quantity": number;
    readonly "dialog": number;
    readonly "rate": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type AttributeRandomDefinitionCatalog = CatalogTable<AttributeRandomDefinition>;
