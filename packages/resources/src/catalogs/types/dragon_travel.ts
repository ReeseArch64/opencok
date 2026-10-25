export interface DragonTravelDefinition {
  readonly "id": number;
  readonly "type": number;
  readonly "time": number;
  readonly "timePercent": readonly (readonly number[])[];
  readonly "timeReward": number | readonly number[];
  readonly "friendshipCond": readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";
export type DragonTravelDefinitionCatalog = CatalogTable<DragonTravelDefinition>;
