export interface WorldLevelDefinition
{
    readonly "id": number;
    readonly "type": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type WorldLevelDefinitionCatalog = CatalogTable<WorldLevelDefinition>;
