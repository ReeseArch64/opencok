export interface HeroeventDefinition {
  readonly "id": number;
  readonly "type": readonly number[];
  readonly "score": readonly number[];
  readonly "target": readonly (readonly number[])[];
  readonly "reward": readonly (readonly number[])[];
  readonly "value": readonly (readonly number[])[];
  readonly "rankreward": readonly (readonly number[])[];
  readonly "ranklist": readonly number[];
}

import type { CatalogTable } from "@opencok/resources/catalog-model";

export type HeroeventDefinitionCatalog = CatalogTable<HeroeventDefinition>;
