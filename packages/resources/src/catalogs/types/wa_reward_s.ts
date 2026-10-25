export interface WaRewardSDefinition {
  readonly "id": number;
  readonly "min": number;
  readonly "max": number;
  readonly "reward": number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type WaRewardSDefinitionCatalog = CatalogTable<WaRewardSDefinition>;
