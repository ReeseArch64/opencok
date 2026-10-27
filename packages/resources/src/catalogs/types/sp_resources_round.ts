export interface SpResourcesRoundDefinition {
  readonly "id": number;
  readonly "round": number;
  readonly "res": readonly (readonly number[])[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type SpResourcesRoundDefinitionCatalog = CatalogTable<SpResourcesRoundDefinition>;
