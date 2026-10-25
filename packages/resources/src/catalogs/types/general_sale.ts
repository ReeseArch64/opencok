export interface GeneralSaleDefinition {
  readonly "id": number;
  readonly "cardNum1": number;
  readonly "salePrice1": number;
  readonly "showPrice1": number;
  readonly "saleNum1": number;
  readonly "cardNum2": number;
  readonly "salePrice2": number;
  readonly "showPrice2": number;
  readonly "saleNum2": number;
  readonly "cardNum3": number;
  readonly "salePrice3": number;
  readonly "showPrice3": number;
  readonly "saleNum3": number;
  readonly "cardNum4": number;
  readonly "salePrice4": number;
  readonly "showPrice4": number;
  readonly "saleNum4": number;
  readonly "saleSum": number;
  readonly "limit": number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type GeneralSaleDefinitionCatalog = CatalogTable<GeneralSaleDefinition>;
