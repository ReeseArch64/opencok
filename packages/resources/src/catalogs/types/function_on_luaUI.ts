export interface FunctionOnLuaUIDefinition
{
    readonly "id": string;
    readonly "online": string;
    readonly "test": string;
    readonly "version": string;
    readonly "pf": string;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type FunctionOnLuaUIDefinitionCatalog = CatalogTable<FunctionOnLuaUIDefinition>;
