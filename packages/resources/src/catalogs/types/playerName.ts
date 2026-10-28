export interface PlayerNameDefinition
{
    readonly "id": number;
    readonly "name": string;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type PlayerNameDefinitionCatalog = CatalogTable<PlayerNameDefinition>;
