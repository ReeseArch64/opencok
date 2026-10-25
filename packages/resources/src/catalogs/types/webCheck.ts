export interface WebCheckDefinition {
  readonly "id": string;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type WebCheckDefinitionCatalog = CatalogTable<WebCheckDefinition>;
