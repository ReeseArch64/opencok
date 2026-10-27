export interface SoldiersDefinition {
  readonly "id": number;
  readonly "castleLV": number;
  readonly "rewardID1": readonly number[];
  readonly "rewardID2": readonly number[];
  readonly "rewardID3": readonly number[];
  readonly "rewardID4": readonly number[];
  readonly "rewardID5": readonly number[];
  readonly "rewardID6": readonly number[];
  readonly "negativeID1": readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type SoldiersDefinitionCatalog = CatalogTable<SoldiersDefinition>;
