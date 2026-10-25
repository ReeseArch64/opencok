export interface WkRewardDefinition {
  readonly "id": number;
  readonly "min": number;
  readonly "max": number;
  readonly "score": readonly number[];
  readonly "reward": number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type WkRewardDefinitionCatalog = CatalogTable<WkRewardDefinition>;
