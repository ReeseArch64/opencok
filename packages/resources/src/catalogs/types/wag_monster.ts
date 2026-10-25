export interface WagMonsterDefinition {
  readonly "id": number;
  readonly "monster": number;
  readonly "randomRate": number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type WagMonsterDefinitionCatalog = CatalogTable<WagMonsterDefinition>;
