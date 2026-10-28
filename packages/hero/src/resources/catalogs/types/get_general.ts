export interface GetGeneralDefinition
{
    readonly "id": number;
    readonly "heroId": number;
    readonly "type": readonly number[];
}

import type { CatalogTable } from "@opencok/resources/catalog-model";

export type GetGeneralDefinitionCatalog = CatalogTable<GetGeneralDefinition>;
