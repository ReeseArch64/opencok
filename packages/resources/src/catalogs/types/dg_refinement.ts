export interface DgRefinementDefinition {
  readonly "id": number;
  readonly "effect": readonly (readonly number[])[];
  readonly "rate": readonly number[];
  readonly "dialog": readonly number[];
  readonly "min": readonly number[];
  readonly "max": readonly number[];
  readonly "k": readonly number[];
  readonly "quantity": number;
  readonly "cost": number;
  readonly "decimal": readonly number[];
  readonly "lockRate": string;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type DgRefinementDefinitionCatalog = CatalogTable<DgRefinementDefinition>;
