export interface PowerRandomDefinition {
  readonly "id": number;
  readonly "times": number;
  readonly "ran1": number;
  readonly "ran2": number;
  readonly "ran3": number;
  readonly "iron": bigint;
  readonly "time": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type PowerRandomDefinitionCatalog = CatalogTable<PowerRandomDefinition>;
