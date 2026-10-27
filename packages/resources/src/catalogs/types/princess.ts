export interface PrincessDefinition {
  readonly "id": number;
  readonly "castleLV": number;
  readonly "rewardID1": readonly number[];
  readonly "rewardID2": readonly number[];
  readonly "rewardID3": readonly number[];
  readonly "rewardID4": readonly number[];
  readonly "rewardID5": readonly number[];
  readonly "rewardID6": readonly number[];
  readonly "sort": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type PrincessDefinitionCatalog = CatalogTable<PrincessDefinition>;
