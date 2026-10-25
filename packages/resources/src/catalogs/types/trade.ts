export interface TradeDefinition {
  readonly "id": number;
  readonly "poolNum": number;
  readonly "castleLevel": readonly number[];
  readonly "recycleItem": number;
  readonly "range": number | readonly number[];
  readonly "quantity": number;
  readonly "rate": number;
  readonly "exchangeItem": number | readonly number[];
  readonly "exchangeRate": number | readonly number[];
  readonly "exchangeNum"?: number | readonly number[];
  readonly "premium"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type TradeDefinitionCatalog = CatalogTable<TradeDefinition>;
