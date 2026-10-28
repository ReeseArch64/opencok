export interface Resource3Definition
{
    readonly "id": number;
    readonly "areaLevel": number;
    readonly "ratio": number;
    readonly "resType": number;
    readonly "resource": number;
    readonly "army": number;
    readonly "reward": number;
    readonly "limit": number;
    readonly "time": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type Resource3DefinitionCatalog = CatalogTable<Resource3Definition>;
