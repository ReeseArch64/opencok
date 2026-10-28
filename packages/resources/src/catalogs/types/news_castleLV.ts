export interface NewsCastleLVDefinition
{
    readonly "id": number;
    readonly "activityType": readonly (readonly number[])[];
    readonly "castleLv": number;
    readonly "lvReward": number;
    readonly "SharingCondition": readonly number[];
    readonly "SharedReward": readonly number[];
    readonly "exchangeId": number | readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type NewsCastleLVDefinitionCatalog = CatalogTable<NewsCastleLVDefinition>;
