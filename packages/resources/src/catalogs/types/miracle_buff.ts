export interface MiracleBuffDefinition {
  readonly "id": number;
  readonly "level": number;
  readonly "type"?: number;
  readonly "order"?: number;
  readonly "para"?: readonly (readonly (readonly number[])[])[];
}

import type { CatalogTable } from "../../catalog-model.ts";
export type MiracleBuffDefinitionCatalog = CatalogTable<MiracleBuffDefinition>;
