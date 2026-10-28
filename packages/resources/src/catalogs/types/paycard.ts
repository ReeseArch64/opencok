export interface PaycardDefinition
{
    readonly "id": number;
    readonly "castleLv": readonly number[];
    readonly "cardNum": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type PaycardDefinitionCatalog = CatalogTable<PaycardDefinition>;
