export interface GoldenEggStepDefinition {
  readonly "id": number;
  readonly "step": readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";
export type GoldenEggStepDefinitionCatalog = CatalogTable<GoldenEggStepDefinition>;
