export interface WrTroopsPointDefinition
{
    readonly "id": number;
    readonly "level": number;
    readonly "militaryRank": number;
    readonly "honor": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type WrTroopsPointDefinitionCatalog = CatalogTable<WrTroopsPointDefinition>;
