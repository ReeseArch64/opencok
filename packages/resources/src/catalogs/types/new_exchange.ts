export interface NewExchangeDefinition {
  readonly "buyTime"?: number;
  readonly "count"?: number;
  readonly "dollar": number;
  readonly "giftShow"?: number | readonly number[] | string;
  readonly "goldDoller": number;
  readonly "group"?: number;
  readonly "id": number;
  readonly "info"?: number;
  readonly "mail"?: number;
  readonly "name"?: number;
  readonly "percent"?: number;
  readonly "popup"?: number;
  readonly "price"?: bigint | number;
  readonly "productId": string;
  readonly "resourceSubtype"?: number;
  readonly "resourceType"?: number;
  readonly "reward"?: number | readonly number[];
  readonly "slogan"?: number;
  readonly "sortOrder"?: number;
  readonly "type": number;
  readonly "secondBuilding"?: number;
  readonly "secondScience"?: number;
  readonly "popupImage"?: number | string;
  readonly "giftMail"?: number;
  readonly "item"?: readonly (readonly number[])[] | string;
  readonly "md5"?: string;
  readonly "para4"?: number;
  readonly "reset"?: number;
  readonly "showType"?: number;
  readonly "stamp"?: string;
  readonly "expresstionTime"?: string;
  readonly "para5"?: number;
  readonly "options"?: string;
  readonly "para3"?: number;
  readonly "message"?: number;
  readonly "para2"?: number;
  readonly "md5Android"?: string;
  readonly "md5Ios"?: string;
  readonly "time"?: number;
  readonly "buff"?: number;
  readonly "para6"?: string;
  readonly "para7"?: readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type NewExchangeDefinitionCatalog = CatalogTable<NewExchangeDefinition>;
