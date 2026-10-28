export interface WrSeverDefinition
{
    readonly "id": number;
    readonly "sever": string;
    readonly "count": number;
    readonly "time": string;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type WrSeverDefinitionCatalog = CatalogTable<WrSeverDefinition>;
