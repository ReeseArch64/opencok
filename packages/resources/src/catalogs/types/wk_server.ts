export interface WkServerDefinition {
  readonly "id": number;
  readonly "value": number;
  readonly "time": number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type WkServerDefinitionCatalog = CatalogTable<WkServerDefinition>;
