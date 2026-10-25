export interface BestowTitleDefinition {
  readonly "id": number;
  readonly "statusId": number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type BestowTitleDefinitionCatalog = CatalogTable<BestowTitleDefinition>;
