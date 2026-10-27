export interface ScoreDefinition {
  readonly "id": number;
  readonly "type": number;
  readonly "value"?: number | readonly number[];
  readonly "points": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type ScoreDefinitionCatalog = CatalogTable<ScoreDefinition>;
