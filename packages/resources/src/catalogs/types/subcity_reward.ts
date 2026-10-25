export interface SubcityRewardDefinition {
  readonly "id": number;
  readonly "reward": number;
  readonly "refreshTime": number;
  readonly "lifeTime": number;
  readonly "position": readonly number[];
  readonly "area": number;
  readonly "rate": number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type SubcityRewardDefinitionCatalog = CatalogTable<SubcityRewardDefinition>;
