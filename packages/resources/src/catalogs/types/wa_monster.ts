export interface WaMonsterDefinition {
  readonly "id": number;
  readonly "monster": number;
  readonly "randomRate": number;
  readonly "type"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type WaMonsterDefinitionCatalog = CatalogTable<WaMonsterDefinition>;
