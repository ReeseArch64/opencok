export interface ComebackDefinition
{
    readonly "id": number;
    readonly "StartTime": number;
    readonly "LastTime": number;
    readonly "targetSetupTime": number;
    readonly "userType": number;
    readonly "activityType": readonly (readonly number[])[];
    readonly "rewardBack": number;
    readonly "daily": readonly number[];
    readonly "rewardDaily": readonly number[];
    readonly "castleLv": number;
    readonly "payLv": number;
    readonly "lordLv": number;
    readonly "lostDate": number;
    readonly "server": number;
    readonly "country": number;
    readonly "language": number;
    readonly "version": number;
    readonly "platform": number;
    readonly "popup": number;
    readonly "lostCondition": number;
    readonly "mail": number;
    readonly "weight": number;
    readonly "payNode": number;
    readonly "payReward": number;
    readonly "backType": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type ComebackDefinitionCatalog = CatalogTable<ComebackDefinition>;
