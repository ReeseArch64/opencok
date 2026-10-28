export interface MonarchDefinition
{
    readonly "id": number;
    readonly "type": number;
    readonly "serverId": number;
    readonly "gameServers": readonly number[];
    readonly "condition": string;
    readonly "buffEffect": readonly number[];
    readonly "buffNum": readonly number[];
    readonly "burnSpeed": readonly number[];
    readonly "burnTime": number;
    readonly "rewardMail": readonly number[];
    readonly "awardRewardMail": readonly number[];
    readonly "awardNum": readonly number[];
    readonly "superarmyItem": string;
    readonly "superarmyItemGoods": number;
    readonly "palaceValue": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type MonarchDefinitionCatalog = CatalogTable<MonarchDefinition>;
