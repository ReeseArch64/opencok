export interface AffairsDefinition {
  readonly "id": number;
  readonly "type": number;
  readonly "quality": number;
  readonly "levelLimit": number;
  readonly "affairTime": number;
  readonly "rewardSupport": number;
  readonly "baseReward": readonly (readonly number[])[];
  readonly "reward1": readonly (readonly number[])[];
  readonly "reward2": readonly (readonly number[])[];
  readonly "reward3": readonly number[];
  readonly "rateSpecial": number;
  readonly "specialCost": number;
  readonly "affairContent": number | readonly number[];
  readonly "nextAffair": readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type AffairsDefinitionCatalog = CatalogTable<AffairsDefinition>;
