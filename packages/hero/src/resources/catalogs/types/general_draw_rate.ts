export interface GeneralDrawRateDefinition
{
    readonly "id": number;
    readonly "tittle": number;
    readonly "rateShow": readonly (readonly number[])[];
}

import type { CatalogTable } from "@opencok/resources/catalog-model";

export type GeneralDrawRateDefinitionCatalog = CatalogTable<GeneralDrawRateDefinition>;
