export interface MonsterSiegeRewardDefinition {
  readonly "id": number;
  readonly "memberKill"?: number;
  readonly "allianceKill"?: number;
  readonly "reward": number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type MonsterSiegeRewardDefinitionCatalog = CatalogTable<MonsterSiegeRewardDefinition>;
