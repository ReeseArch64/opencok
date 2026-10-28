export interface GrowthFundDefinition
{
    readonly "id": number;
    readonly "type": number;
    readonly "level": number;
    readonly "reward": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type GrowthFundDefinitionCatalog = CatalogTable<GrowthFundDefinition>;
