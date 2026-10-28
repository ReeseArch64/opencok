export interface ShopNew7210Definition
{
    readonly "id": number;
    readonly "itemId": number;
    readonly "saleType": number;
    readonly "page": number;
    readonly "display": number;
    readonly "onsale"?: number;
    readonly "onsaleType": number;
    readonly "beginTime": number | readonly number[];
    readonly "saleLife": number;
    readonly "totalTimes": number;
    readonly "buyTimes": number;
    readonly "buyTimesRefreshCount": number;
    readonly "buyTimesRefresh": number;
    readonly "timesRefresh": number;
    readonly "buyTimesDaily": number | readonly number[];
    readonly "sale": number;
    readonly "price": bigint;
    readonly "value1Type": number;
    readonly "value1": number | readonly number[];
    readonly "value1A": number;
    readonly "value2Type": number;
    readonly "value2": number;
    readonly "value2A": number;
    readonly "level": number;
    readonly "castleLevel": number;
    readonly "register": number;
    readonly "militaryRank": number;
    readonly "version": string;
    readonly "server": string;
    readonly "type2"?: number;
    readonly "experience"?: number;
    readonly "svipShopLevel"?: number;
    readonly "valueItem"?: number;
    readonly "valueItemNum"?: number;
    readonly "discount"?: readonly (readonly number[])[];
    readonly "prestigeLevel"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type ShopNew7210DefinitionCatalog = CatalogTable<ShopNew7210Definition>;
