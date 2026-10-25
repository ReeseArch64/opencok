export interface EquipmentStrengthenMoveDefinition {
  readonly "id": number;
  readonly "level": number;
  readonly "color": number;
  readonly "goodsid": number;
  readonly "quantity": number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type EquipmentStrengthenMoveDefinitionCatalog =
  CatalogTable<EquipmentStrengthenMoveDefinition>;
