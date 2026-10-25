export interface NewbieItemsDefinition {
  readonly "id": number;
  readonly "count": number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type NewbieItemsDefinitionCatalog = CatalogTable<NewbieItemsDefinition>;
