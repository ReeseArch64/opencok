export interface NewDailyTaskDefinition
{
    readonly "id": number;
    readonly "groupType": number;
    readonly "cond": readonly (readonly number[])[];
    readonly "weight": number;
    readonly "type": number;
    readonly "quantity": number | readonly number[];
    readonly "normalReward": readonly (readonly number[])[];
    readonly "specialReward": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type NewDailyTaskDefinitionCatalog = CatalogTable<NewDailyTaskDefinition>;
