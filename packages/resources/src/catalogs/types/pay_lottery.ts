export interface PayLotteryDefinition
{
    readonly "id": number;
    readonly "pay": number;
    readonly "range": string;
    readonly "times": string;
    readonly "luckyRange": string;
    readonly "luckyTimes": string;
    readonly "luckyRate": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type PayLotteryDefinitionCatalog = CatalogTable<PayLotteryDefinition>;
