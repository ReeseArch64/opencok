export interface NewcomerTreviFountainDefinition
{
    readonly "id": number;
    readonly "level": number;
    readonly "goldNum": number;
    readonly "repayPer": readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type NewcomerTreviFountainDefinitionCatalog = CatalogTable<NewcomerTreviFountainDefinition>;
