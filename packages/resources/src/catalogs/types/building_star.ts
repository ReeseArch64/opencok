export interface BuildingStarDefinition {
  readonly "id": number;
  readonly "level": number;
  readonly "wood"?: bigint;
  readonly "stone"?: bigint;
  readonly "iron"?: bigint;
  readonly "food"?: bigint;
  readonly "silver"?: bigint;
  readonly "time": number;
  readonly "experience": number;
  readonly "starOn"?: number;
  readonly "quantity"?: number;
  readonly "building"?: readonly (readonly number[])[];
  readonly "destroyTime"?: number;
  readonly "power"?: number;
  readonly "para1"?: number | readonly number[];
  readonly "para2"?: number | readonly number[];
  readonly "para4"?: number | readonly number[];
  readonly "para3"?: number | readonly number[];
  readonly "starTime"?: readonly (readonly number[])[];
  readonly "starExp"?: readonly (readonly number[])[];
  readonly "starPower"?: readonly (readonly number[])[];
  readonly "starRes"?: readonly (readonly number[])[];
  readonly "starItem"?: readonly (readonly number[])[];
  readonly "starBuilding"?: readonly (readonly number[])[];
  readonly "item"?: number | readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";
export type BuildingStarDefinitionCatalog = CatalogTable<BuildingStarDefinition>;
