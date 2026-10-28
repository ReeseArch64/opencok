export interface ExchangeDefinition
{
    readonly "id": number;
    readonly "type": number;
    readonly "productId": string;
    readonly "dollar": number;
    readonly "goldDoller": number;
    readonly "timeType": number;
    readonly "start"?: number | readonly number[] | string;
    readonly "mail"?: number;
    readonly "message"?: number;
    readonly "messagePlat"?: string;
    readonly "sales"?: number;
    readonly "popupImage"?: string;
    readonly "md5"?: string;
    readonly "name"?: number;
    readonly "price"?: bigint | number;
    readonly "platform"?: string;
    readonly "time"?: number;
    readonly "count"?: number;
    readonly "percent"?: number;
    readonly "popup"?: number;
    readonly "version"?: string;
    readonly "buff"?: number;
    readonly "item"?: readonly (readonly number[])[];
    readonly "slogan"?: number;
    readonly "condition"?: readonly (readonly number[])[] | string;
    readonly "reset"?: number;
    readonly "group"?: number;
    readonly "stamp"?: string;
    readonly "giftMail"?: number;
    readonly "end"?: string;
    readonly "showType"?: number;
    readonly "nextgift"?: number;
    readonly "forwardgift"?: number;
    readonly "reward"?: number;
    readonly "googlecodeMail"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type ExchangeDefinitionCatalog = CatalogTable<ExchangeDefinition>;
