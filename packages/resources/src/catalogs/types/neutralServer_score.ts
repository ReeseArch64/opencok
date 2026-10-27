export interface NeutralServerScoreDefinition {
  readonly "id": number;
  readonly "level": number;
  readonly "score": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type NeutralServerScoreDefinitionCatalog = CatalogTable<NeutralServerScoreDefinition>;
