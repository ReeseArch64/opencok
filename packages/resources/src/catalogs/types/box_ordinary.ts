export interface BoxOrdinaryDefinition {
  readonly "id": number;
  readonly "type": number;
  readonly "condRate": number;
  readonly "condition": readonly (readonly number[])[];
  readonly "rate": readonly number[];
  readonly "rateLuckyday": readonly number[];
  readonly "payReward": readonly number[];
  readonly "specialReward": readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type BoxOrdinaryDefinitionCatalog = CatalogTable<BoxOrdinaryDefinition>;
