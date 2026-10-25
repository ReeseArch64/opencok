export interface AllianceBossDefinition {
  readonly "id": number;
  readonly "type": number;
  readonly "name": number;
  readonly "level": number;
  readonly "groupid": number;
  readonly "time": number;
  readonly "power": number;
  readonly "score": number;
  readonly "army": number;
  readonly "maxhp": number;
  readonly "deadratio": number;
  readonly "damageReward": string;
  readonly "killReward": number;
  readonly "k1": number | string;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type AllianceBossDefinitionCatalog = CatalogTable<AllianceBossDefinition>;
