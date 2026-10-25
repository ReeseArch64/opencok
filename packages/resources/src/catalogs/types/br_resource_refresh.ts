export interface BrResourceRefreshDefinition {
  readonly "id": number;
  readonly "range": readonly number[];
  readonly "quantity": number;
  readonly "build": number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type BrResourceRefreshDefinitionCatalog = CatalogTable<BrResourceRefreshDefinition>;
