export interface PositionUnlockDefinition {
  readonly "id": number;
  readonly "level": number;
  readonly "unlock"?: number;
  readonly "position": readonly number[];
  readonly "wood": bigint;
  readonly "stone": bigint;
  readonly "iron": bigint;
  readonly "food": bigint;
  readonly "silver": bigint;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type PositionUnlockDefinitionCatalog = CatalogTable<PositionUnlockDefinition>;
