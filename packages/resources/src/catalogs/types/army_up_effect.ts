export interface ArmyUpEffectDefinition {
  readonly "id": number;
  readonly "armyType": number;
  readonly "level": number;
  readonly "effect": readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";
export type ArmyUpEffectDefinitionCatalog = CatalogTable<ArmyUpEffectDefinition>;
