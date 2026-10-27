export interface WkPersonRewardDefinition {
  readonly "id": number;
  readonly "reward": number;
  readonly "score": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type WkPersonRewardDefinitionCatalog = CatalogTable<WkPersonRewardDefinition>;
