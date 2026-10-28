export interface AddUserGoodsDefinition
{
    readonly "id": number;
    readonly "count": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type AddUserGoodsDefinitionCatalog = CatalogTable<AddUserGoodsDefinition>;
