export interface TowerDefinition {
  readonly "id": number;
  readonly "type": number;
  readonly "armyLimit"?: number;
  readonly "numAttack"?: number;
  readonly "time": number;
  readonly "idStatus"?: number;
  readonly "para"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type TowerDefinitionCatalog = CatalogTable<TowerDefinition>;
