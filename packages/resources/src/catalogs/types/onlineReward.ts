export interface OnlineRewardDefinition {
  readonly "id": number;
  readonly "castleLV": number;
  readonly "rewardID1": number;
  readonly "rewardID2": number;
  readonly "rewardID3": number;
  readonly "rewardID4": number;
  readonly "rewardID5": number;
  readonly "rewardID6": number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type OnlineRewardDefinitionCatalog = CatalogTable<OnlineRewardDefinition>;
