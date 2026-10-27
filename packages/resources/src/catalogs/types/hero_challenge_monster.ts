export interface HeroChallengeMonsterDefinition {
  readonly "id": number;
  readonly "army": readonly (readonly number[])[];
  readonly "buff": readonly (readonly number[])[];
  readonly "firstReward": number;
  readonly "commonReward": number;
  readonly "weight": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type HeroChallengeMonsterDefinitionCatalog = CatalogTable<HeroChallengeMonsterDefinition>;
