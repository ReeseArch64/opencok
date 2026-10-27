export interface SkillDefinition {
  readonly "id": number;
  readonly "type2"?: number;
  readonly "debuffRateEffect"?: number;
  readonly "times"?: number;
  readonly "type"?: number;
  readonly "typePara"?: number;
  readonly "object"?: number;
  readonly "objectNum"?: number;
  readonly "effect"?: readonly (readonly number[])[];
  readonly "effectIncrease"?: number;
  readonly "rate"?: number;
  readonly "rateAdd"?: number;
  readonly "effectAdd"?: readonly (readonly number[])[];
  readonly "objectOdds"?: number;
  readonly "status"?: number;
  readonly "statusRate"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type SkillDefinitionCatalog = CatalogTable<SkillDefinition>;
