export interface ArenaDefinition {
  readonly "id": number;
  readonly "reputation": number;
  readonly "reputation2": number;
  readonly "area": number;
  readonly "income": number | readonly number[];
  readonly "defendIncome": readonly number[];
  readonly "atkEffect": readonly number[];
  readonly "hpEffect": readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";
export type ArenaDefinitionCatalog = CatalogTable<ArenaDefinition>;
