export interface CompensationDefinition
{
    readonly "id": number;
    readonly "compentime": number;
    readonly "lost": number;
    readonly "cdtime": number;
    readonly "rateNum": number;
    readonly "rateRes": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type CompensationDefinitionCatalog = CatalogTable<CompensationDefinition>;
