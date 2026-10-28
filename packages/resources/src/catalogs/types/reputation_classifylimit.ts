export interface ReputationClassifylimitDefinition
{
    readonly "id": number;
    readonly "type": number;
    readonly "limitValue": readonly (readonly number[])[];
    readonly "condition": readonly number[];
    readonly "dialog": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type ReputationClassifylimitDefinitionCatalog = CatalogTable<
    ReputationClassifylimitDefinition
>;
