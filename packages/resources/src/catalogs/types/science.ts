export interface ScienceDefinition {
  readonly "id": number;
  readonly "scienceLv"?: number;
  readonly "levelMax"?: number;
  readonly "buildingCondition"?: number;
  readonly "researchNeed"?: readonly (readonly number[])[];
  readonly "timeResearch"?: number;
  readonly "para1"?: number | readonly number[];
  readonly "para2"?: number;
  readonly "power"?: number;
  readonly "scienceCondition"?: number | readonly number[];
  readonly "sciencePoint"?: readonly number[];
  readonly "mark"?: number;
  readonly "conditionMark"?: number;
  readonly "condition"?: number;
  readonly "vip"?: number;
  readonly "skill"?: number;
  readonly "reputationCondition"?: readonly number[];
  readonly "tab"?: number;
  readonly "name"?: number;
  readonly "description"?: number;
  readonly "icon"?: string;
  readonly "position"?: readonly number[];
  readonly "relation"?: readonly number[];
  readonly "show"?: number;
  readonly "lvpower"?: readonly number[];
  readonly "lvpropadd"?: readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type ScienceDefinitionCatalog = CatalogTable<ScienceDefinition>;
