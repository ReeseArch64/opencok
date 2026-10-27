export interface DragonTowerBuffDefinition {
  readonly "id": number;
  readonly "type": number;
  readonly "effect"?: readonly (readonly number[])[];
  readonly "time": number;
  readonly "weight": number;
  readonly "group": number;
  readonly "unlockLayer": number;
  readonly "gold": bigint;
  readonly "score": number;
  readonly "army"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type DragonTowerBuffDefinitionCatalog = CatalogTable<DragonTowerBuffDefinition>;
