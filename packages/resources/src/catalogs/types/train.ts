export interface TrainDefinition {
  readonly "id": number;
  readonly "rateExp": number;
  readonly "totalTime": number;
  readonly "spending": number;
  readonly "suddenly": number;
  readonly "entryTime": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type TrainDefinitionCatalog = CatalogTable<TrainDefinition>;
