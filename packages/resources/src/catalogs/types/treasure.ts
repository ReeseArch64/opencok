export interface TreasureDefinition
{
    readonly "id": number;
    readonly "level": number;
    readonly "experience": number;
    readonly "helper": number;
    readonly "gold": bigint;
    readonly "rateGold": readonly number[];
    readonly "item": string;
    readonly "rateItem": readonly number[];
    readonly "weektime": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type TreasureDefinitionCatalog = CatalogTable<TreasureDefinition>;
