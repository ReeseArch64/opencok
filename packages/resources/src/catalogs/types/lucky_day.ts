export interface LuckyDayDefinition
{
    readonly "id": number;
    readonly "times24hr": number;
    readonly "openLevel": number;
    readonly "openRate": number;
    readonly "rndTimes": number;
    readonly "openTime": number;
    readonly "lifeTime": number;
    readonly "effect": number | readonly number[];
    readonly "effectRate": number | readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type LuckyDayDefinitionCatalog = CatalogTable<LuckyDayDefinition>;
