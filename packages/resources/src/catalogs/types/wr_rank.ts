export interface WrRankDefinition
{
    readonly "id": number;
    readonly "type": number;
    readonly "level": number;
    readonly "experience": number;
    readonly "name": number;
    readonly "status"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type WrRankDefinitionCatalog = CatalogTable<WrRankDefinition>;
