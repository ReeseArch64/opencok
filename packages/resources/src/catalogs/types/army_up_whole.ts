export interface ArmyUpWholeDefinition {
  readonly "id": number;
  readonly "levelSum": number;
  readonly "addExp": number;
  readonly "cost": number;
  readonly "step": number;
  readonly "roll": readonly number[];
  readonly "effect": readonly (readonly number[])[];
  readonly "skill": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type ArmyUpWholeDefinitionCatalog = CatalogTable<ArmyUpWholeDefinition>;
