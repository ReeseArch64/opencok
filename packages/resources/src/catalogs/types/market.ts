export interface MarketDefinition {
  readonly "id": number;
  readonly "type": number;
  readonly "pare": number;
  readonly "levelNum": readonly number[];
  readonly "levelRate": readonly number[];
  readonly "total": number;
  readonly "priceType": number;
  readonly "price": bigint;
  readonly "condition"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type MarketDefinitionCatalog = CatalogTable<MarketDefinition>;
