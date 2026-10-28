export interface ReforgeRandomDefinition
{
    readonly "id": number;
    readonly "effect": readonly (readonly number[])[];
    readonly "rate": readonly number[];
    readonly "valueType": readonly number[];
    readonly "dialog": readonly number[];
    readonly "value0": readonly number[];
    readonly "value1": readonly number[];
    readonly "value2": readonly number[];
    readonly "value3": readonly number[];
    readonly "value4": readonly number[];
    readonly "value5": readonly number[];
    readonly "libraryType": readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type ReforgeRandomDefinitionCatalog = CatalogTable<ReforgeRandomDefinition>;
