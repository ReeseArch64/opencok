export interface WkScoreDefinition {
  readonly "id": number;
  readonly "level": number;
  readonly "score": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type WkScoreDefinitionCatalog = CatalogTable<WkScoreDefinition>;
