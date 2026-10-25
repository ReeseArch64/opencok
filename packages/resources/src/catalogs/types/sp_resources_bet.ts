export interface SpResourcesBetDefinition {
  readonly "id": number;
  readonly "double": number;
  readonly "rate"?: number;
  readonly "criticalrate"?: number;
  readonly "redouble"?: number;
  readonly "cost"?: number;
  readonly "sprate"?: number;
  readonly "spcriticalrate"?: number;
  readonly "spredouble"?: number;
  readonly "spcost"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type SpResourcesBetDefinitionCatalog = CatalogTable<SpResourcesBetDefinition>;
