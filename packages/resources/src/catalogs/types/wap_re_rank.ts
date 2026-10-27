export interface WapReRankDefinition {
  readonly "id": number;
  readonly "rank": number;
  readonly "reward": number;
  readonly "tpye": number | readonly number[];
  readonly "quantity": number | readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type WapReRankDefinitionCatalog = CatalogTable<WapReRankDefinition>;
