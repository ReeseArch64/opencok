export interface GoldenEggDefinition {
  readonly "id": number;
  readonly "type": number;
  readonly "rate": number;
  readonly "score": number;
  readonly "max"?: number;
  readonly "reward"?: number;
  readonly "status"?: readonly (readonly number[])[];
}

import type { CatalogTable } from "../../catalog-model.ts";
export type GoldenEggDefinitionCatalog = CatalogTable<GoldenEggDefinition>;
