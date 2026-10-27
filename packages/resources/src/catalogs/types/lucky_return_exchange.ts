export interface LuckyReturnExchangeDefinition {
  readonly "id": number;
  readonly "price": bigint;
  readonly "reward": number;
  readonly "giftName": number;
  readonly "picture": string;
  readonly "md5": string;
  readonly "androidmd5": string;
  readonly "gold": bigint;
  readonly "value": number;
  readonly "isNew": number;
  readonly "type": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type LuckyReturnExchangeDefinitionCatalog = CatalogTable<LuckyReturnExchangeDefinition>;
