export interface GeneralDrawRateDefinition {
  readonly "id": number;
  readonly "tittle": number;
  readonly "rateShow": readonly (readonly number[])[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type GeneralDrawRateDefinitionCatalog = CatalogTable<GeneralDrawRateDefinition>;
