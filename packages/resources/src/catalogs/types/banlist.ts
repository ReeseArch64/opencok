export interface BanlistDefinition {
  readonly "id": string;
  readonly "online": readonly number[];
  readonly "test": string;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type BanlistDefinitionCatalog = CatalogTable<BanlistDefinition>;
