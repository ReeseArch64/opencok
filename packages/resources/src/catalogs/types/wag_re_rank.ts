export interface WagReRankDefinition {
  readonly "id": number;
  readonly "rank": number;
  readonly "reward": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type WagReRankDefinitionCatalog = CatalogTable<WagReRankDefinition>;
