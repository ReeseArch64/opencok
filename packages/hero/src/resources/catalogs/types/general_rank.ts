export interface GeneralRankDefinition
{
    readonly "term": number;
    readonly "type": number;
    readonly "id": number;
    readonly "reward": string;
    readonly "mail": string;
    readonly "startTime": string;
    readonly "endTime": string;
    readonly "pic": string;
}

import type { CatalogTable } from "@opencok/resources/catalog-model";

export type GeneralRankDefinitionCatalog = CatalogTable<GeneralRankDefinition>;
