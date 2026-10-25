export interface HeroChallengeLayerDefinition {
  readonly "id": number;
  readonly "level": number;
  readonly "limitTime": number;
  readonly "buildingCondition": number;
  readonly "monster": readonly number[];
  readonly "refreshPrice": number;
  readonly "deathRate": number;
  readonly "firstMonster": number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type HeroChallengeLayerDefinitionCatalog = CatalogTable<HeroChallengeLayerDefinition>;
