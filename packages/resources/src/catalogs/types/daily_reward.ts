export interface DailyRewardDefinition {
  readonly "id": number;
  readonly "point": number;
  readonly "reward": readonly number[];
  readonly "rewardSvip": readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type DailyRewardDefinitionCatalog = CatalogTable<DailyRewardDefinition>;
