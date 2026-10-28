export interface NewWkRewardDefinition
{
    readonly "id": number;
    readonly "stage": number;
    readonly "time": number;
    readonly "name": number;
    readonly "cross": number;
    readonly "score"?: readonly number[];
    readonly "rankreward"?: string;
    readonly "statereward"?: string;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type NewWkRewardDefinitionCatalog = CatalogTable<NewWkRewardDefinition>;
