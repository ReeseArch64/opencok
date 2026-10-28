export interface ServerposDefinition
{
    readonly "id": number;
    readonly "X": number;
    readonly "Y": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type ServerposDefinitionCatalog = CatalogTable<ServerposDefinition>;
