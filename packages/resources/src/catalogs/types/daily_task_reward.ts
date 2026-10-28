export interface DailyTaskRewardDefinition
{
    readonly "id": number;
    readonly "point": number;
    readonly "reward": readonly (readonly number[])[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type DailyTaskRewardDefinitionCatalog = CatalogTable<DailyTaskRewardDefinition>;
