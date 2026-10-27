export interface GoldPriceDefinition {
  readonly "id": number;
  readonly "productId": string;
  readonly "exchangeId": number;
  readonly "VK": number;
  readonly "QQ": number;
  readonly "mycard": number;
  readonly "gash": number;
  readonly "kg": number;
  readonly "dmm": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type GoldPriceDefinitionCatalog = CatalogTable<GoldPriceDefinition>;
