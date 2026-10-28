export interface GoldRewardDefinition
{
    readonly "id": number;
    readonly "Needgold": number;
    readonly "Range": readonly (readonly number[])[];
    readonly "weight": number | readonly number[];
    readonly "Seq": number;
    readonly "vip": number;
    readonly "dialog": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type GoldRewardDefinitionCatalog = CatalogTable<GoldRewardDefinition>;
