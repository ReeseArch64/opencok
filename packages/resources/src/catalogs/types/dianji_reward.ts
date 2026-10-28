export interface DianjiRewardDefinition
{
    readonly "id": number;
    readonly "level": readonly number[];
    readonly "reward": readonly number[];
    readonly "goal": readonly number[];
    readonly "total": number;
    readonly "rate": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type DianjiRewardDefinitionCatalog = CatalogTable<DianjiRewardDefinition>;
