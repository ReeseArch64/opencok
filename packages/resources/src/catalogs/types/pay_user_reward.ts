export interface PayUserRewardDefinition {
  readonly "id": number;
  readonly "time": number;
  readonly "reward": number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type PayUserRewardDefinitionCatalog = CatalogTable<PayUserRewardDefinition>;
