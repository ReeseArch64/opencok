export interface GoodsDefinition {
  readonly "id": bigint | number | string;
  readonly "type"?: number;
  readonly "levelLimit"?: number;
  readonly "price"?: bigint;
  readonly "priceAll"?: bigint;
  readonly "priceHot"?: bigint;
  readonly "color"?: number;
  readonly "isGift"?: number | string;
  readonly "timeType"?: number;
  readonly "vanishTime"?: number;
  readonly "useall"?: number;
  readonly "use"?: number;
  readonly "sales"?: number | readonly (readonly number[])[];
  readonly "para2"?: number | readonly (readonly number[])[] | string;
  readonly "para1"?: number | readonly (readonly number[])[] | string;
  readonly "para3"?: number | readonly (readonly number[])[] | string;
  readonly "cdTime"?: number;
  readonly "make"?: readonly number[];
  readonly "priceCrystal"?: bigint;
  readonly "para4"?: number | readonly (readonly number[])[];
  readonly "type2"?: number;
  readonly "level"?: number;
  readonly "para5"?: number | readonly number[];
  readonly "permanentProps"?: number;
  readonly "reputationPoint"?: number;
  readonly "itemExchange"?: number;
  readonly "luaLogic"?: number;
  readonly "group"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type GoodsDefinitionCatalog = CatalogTable<GoodsDefinition>;
