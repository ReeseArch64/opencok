export interface LotteryDefinition
{
    readonly "id": number;
    readonly "strategy": number;
    readonly "probability": number;
    readonly "site1": number;
    readonly "site2": number;
    readonly "site3": number;
    readonly "site4": number;
    readonly "site5": number;
    readonly "site6": number;
    readonly "site7": number;
    readonly "site8": number;
    readonly "site9": number;
    readonly "pickmode": readonly (readonly number[])[];
    readonly "condition"?: readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type LotteryDefinitionCatalog = CatalogTable<LotteryDefinition>;
