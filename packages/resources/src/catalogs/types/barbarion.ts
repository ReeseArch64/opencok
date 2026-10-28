export interface BarbarionDefinition
{
    readonly "id": number;
    readonly "army": number;
    readonly "rate1": number;
    readonly "rate2": number;
    readonly "reward": number;
    readonly "armReward": readonly (readonly number[])[];
    readonly "level": number;
    readonly "para1": number;
    readonly "para2": number;
    readonly "para3": number;
    readonly "para4": readonly number[];
    readonly "para5": number;
    readonly "para6": number;
    readonly "para7": number;
    readonly "para8": number;
    readonly "para9": number;
    readonly "para10": readonly number[];
    readonly "para11": number;
    readonly "boss": number;
    readonly "quantity": number;
    readonly "usePower": number;
    readonly "monsterrule1": number;
    readonly "alliance": number;
    readonly "Gift": number;
    readonly "mailFail": number;
    readonly "lifeTime": number | string;
    readonly "areaLevel": number;
    readonly "ratio": number;
    readonly "limitTime": number;
    readonly "overRate": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type BarbarionDefinitionCatalog = CatalogTable<BarbarionDefinition>;
