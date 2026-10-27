export interface DiscountMallDefinition {
  readonly "id": number;
  readonly "itemId": number;
  readonly "percent": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type DiscountMallDefinitionCatalog = CatalogTable<DiscountMallDefinition>;
