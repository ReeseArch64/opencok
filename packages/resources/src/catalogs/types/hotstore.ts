export interface HotstoreDefinition
{
    readonly "id": number;
    readonly "rate": number | readonly number[];
    readonly "item": readonly number[];
    readonly "quantity": number;
    readonly "priceType": number;
    readonly "price": bigint;
    readonly "color"?: number;
    readonly "merchantGoodsType": number;
    readonly "condition"?: readonly (readonly number[])[];
    readonly "priceHot"?: bigint;
    readonly "version"?: string;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type HotstoreDefinitionCatalog = CatalogTable<HotstoreDefinition>;
