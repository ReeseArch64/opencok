export interface CleanDefinition {
  readonly "id": number;
  readonly "castle": number;
  readonly "second": number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type CleanDefinitionCatalog = CatalogTable<CleanDefinition>;
