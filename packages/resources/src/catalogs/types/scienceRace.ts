export interface ScienceRaceDefinition {
  readonly "id": number;
  readonly "scienceLv": number;
  readonly "levelMax": number;
  readonly "researchNeed"?: readonly (readonly number[])[];
  readonly "sciencePoint"?: readonly number[];
  readonly "timeResearch": number;
  readonly "para1"?: number | readonly number[] | string;
  readonly "para2"?: number;
  readonly "power": number;
  readonly "reputationCondition"?: readonly number[];
  readonly "scienceCondition"?: number | readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";
export type ScienceRaceDefinitionCatalog = CatalogTable<ScienceRaceDefinition>;
