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

import type { CatalogTable } from "@opencok/resources/catalog-model";

export type HeroChallengeLayerDefinitionCatalog = CatalogTable<HeroChallengeLayerDefinition>;
