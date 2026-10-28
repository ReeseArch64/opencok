export interface DragonDetailDefinition
{
    readonly "id": number;
    readonly "name": number;
    readonly "effect": number;
    readonly "show": number;
    readonly "buff": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type DragonDetailDefinitionCatalog = CatalogTable<DragonDetailDefinition>;
