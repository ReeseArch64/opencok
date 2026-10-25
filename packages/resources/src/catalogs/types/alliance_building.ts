export interface AllianceBuildingDefinition {
  readonly "id": number;
  readonly "level": number;
  readonly "type": number;
  readonly "outpost"?: number;
  readonly "outpost1"?: number;
  readonly "buildingValue"?: number;
  readonly "effect"?: readonly number[];
  readonly "effectNum"?: readonly number[];
  readonly "status"?: readonly number[];
  readonly "skillTrap"?: readonly (readonly number[])[];
  readonly "building"?: readonly number[];
  readonly "material"?: readonly (readonly number[])[];
  readonly "item"?: number | readonly number[];
  readonly "skill"?: readonly (readonly number[])[];
  readonly "skillItem"?: readonly number[];
  readonly "gold"?: bigint;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type AllianceBuildingDefinitionCatalog = CatalogTable<AllianceBuildingDefinition>;
