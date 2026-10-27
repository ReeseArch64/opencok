export interface KingdomshopDefinition {
  readonly "id": number;
  readonly "itemId": number;
  readonly "value": number;
  readonly "rank": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type KingdomshopDefinitionCatalog = CatalogTable<KingdomshopDefinition>;
