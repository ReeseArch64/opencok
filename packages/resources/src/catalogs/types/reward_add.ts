export interface RewardAddDefinition
{
    readonly "id": number;
    readonly "goodsId": number;
    readonly "add": number;
    readonly "firstTime": string;
    readonly "circle": number;
    readonly "duration": number;
    readonly "activityId": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type RewardAddDefinitionCatalog = CatalogTable<RewardAddDefinition>;
