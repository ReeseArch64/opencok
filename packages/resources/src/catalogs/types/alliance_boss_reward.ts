export interface AllianceBossRewardDefinition {
  readonly "id": number;
  readonly "level": number;
  readonly "groupid": number;
  readonly "time": number;
  readonly "power": number;
  readonly "score": number;
  readonly "army": number;
  readonly "maxhp": number;
  readonly "deadratio": number;
  readonly "rewards": number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type AllianceBossRewardDefinitionCatalog = CatalogTable<AllianceBossRewardDefinition>;
