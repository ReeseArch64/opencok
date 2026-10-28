export interface InspireDefinition
{
    readonly "id": number;
    readonly "rate": number;
    readonly "effect1": readonly number[];
    readonly "effect2": readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type InspireDefinitionCatalog = CatalogTable<InspireDefinition>;
