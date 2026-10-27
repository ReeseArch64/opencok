export interface ForeignCivilizationUpDefinition {
  readonly "id": number;
  readonly "scienceId": number;
  readonly "scienceLv": number;
  readonly "buildingCondition"?: number;
  readonly "wood": bigint;
  readonly "food": bigint;
  readonly "iron": bigint;
  readonly "stone": bigint;
  readonly "item": readonly (readonly number[])[];
  readonly "timeResearch": number;
  readonly "effect": number | readonly number[];
  readonly "value": number | readonly number[];
  readonly "power": number;
  readonly "scienceCondition"?: readonly (readonly number[])[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type ForeignCivilizationUpDefinitionCatalog = CatalogTable<ForeignCivilizationUpDefinition>;
