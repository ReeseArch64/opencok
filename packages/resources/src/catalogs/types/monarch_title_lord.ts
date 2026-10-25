export interface MonarchTitleLordDefinition {
  readonly "id": number;
  readonly "effect": readonly number[];
  readonly "quantity": readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";
export type MonarchTitleLordDefinitionCatalog = CatalogTable<MonarchTitleLordDefinition>;
