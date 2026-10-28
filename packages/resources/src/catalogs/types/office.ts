export interface OfficeDefinition
{
    readonly "id": number;
    readonly "para1": number | readonly number[];
    readonly "para2": number | readonly number[];
    readonly "atk": number;
    readonly "beingAtk": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type OfficeDefinitionCatalog = CatalogTable<OfficeDefinition>;
