export interface WbRewardDefinition
{
    readonly "id": number;
    readonly "reward": number;
    readonly "min"?: number;
    readonly "max"?: number;
    readonly "effect"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type WbRewardDefinitionCatalog = CatalogTable<WbRewardDefinition>;
