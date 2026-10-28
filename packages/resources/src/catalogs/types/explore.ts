export interface ExploreDefinition
{
    readonly "id": number;
    readonly "lvRange": readonly number[];
    readonly "type": number;
    readonly "rate": number;
    readonly "army"?: readonly number[];
    readonly "experience"?: readonly number[];
    readonly "value"?: readonly (readonly number[])[];
    readonly "itemId"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type ExploreDefinitionCatalog = CatalogTable<ExploreDefinition>;
