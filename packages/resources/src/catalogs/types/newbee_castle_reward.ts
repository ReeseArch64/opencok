export interface NewbeeCastleRewardDefinition
{
    readonly "id": number;
    readonly "level": number;
    readonly "reward": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type NewbeeCastleRewardDefinitionCatalog = CatalogTable<NewbeeCastleRewardDefinition>;
