export interface MonarchTitleKingdomDefinition {
  readonly "id": number;
  readonly "effect": readonly number[];
  readonly "quantity": readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type MonarchTitleKingdomDefinitionCatalog = CatalogTable<MonarchTitleKingdomDefinition>;
