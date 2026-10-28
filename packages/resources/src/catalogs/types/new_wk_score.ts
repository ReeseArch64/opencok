export interface NewWkScoreDefinition
{
    readonly "id": number;
    readonly "type": number;
    readonly "value": number | readonly number[];
    readonly "points": number;
    readonly "effect"?: number | readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type NewWkScoreDefinitionCatalog = CatalogTable<NewWkScoreDefinition>;
