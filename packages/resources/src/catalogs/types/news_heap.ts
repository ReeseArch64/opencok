export interface NewsHeapDefinition {
  readonly "id": number;
  readonly "type": number;
  readonly "payNode": number;
  readonly "payReward": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type NewsHeapDefinitionCatalog = CatalogTable<NewsHeapDefinition>;
