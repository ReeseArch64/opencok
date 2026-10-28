export interface CivilizationDefinition
{
    readonly "id": number;
    readonly "type": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type CivilizationDefinitionCatalog = CatalogTable<CivilizationDefinition>;
