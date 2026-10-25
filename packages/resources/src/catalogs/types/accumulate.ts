export interface AccumulateDefinition {
  readonly "id": number;
  readonly "Node": number;
  readonly "Gift": number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type AccumulateDefinitionCatalog = CatalogTable<AccumulateDefinition>;
