export interface EquipmentRandomPowerDefinition {
  readonly "id": number;
  readonly "effect": number | readonly number[];
  readonly "power": number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type EquipmentRandomPowerDefinitionCatalog = CatalogTable<EquipmentRandomPowerDefinition>;
