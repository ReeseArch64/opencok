export interface FunctionStarDefinition
{
    readonly "id": number;
    readonly "level": number;
    readonly "buildId": number;
    readonly "star": number;
    readonly "online": string;
    readonly "test": string;
    readonly "version": string;
    readonly "pf": string;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type FunctionStarDefinitionCatalog = CatalogTable<FunctionStarDefinition>;
