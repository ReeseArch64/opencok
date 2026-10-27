export interface ArenaRankDefinition {
  readonly "id": number;
  readonly "min": number;
  readonly "max": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type ArenaRankDefinitionCatalog = CatalogTable<ArenaRankDefinition>;
