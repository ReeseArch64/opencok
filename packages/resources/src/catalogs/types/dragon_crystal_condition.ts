export interface DragonCrystalConditionDefinition {
  readonly "id": number;
  readonly "color": number;
  readonly "crystalid": number;
  readonly "position": readonly number[];
  readonly "condition"?: number;
  readonly "relation"?: readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";
export type DragonCrystalConditionDefinitionCatalog =
  CatalogTable<DragonCrystalConditionDefinition>;
