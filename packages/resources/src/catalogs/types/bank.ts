export interface BankDefinition
{
    readonly "id": number;
    readonly "type": number;
    readonly "condition": readonly number[];
    readonly "gold": bigint;
    readonly "time": number;
    readonly "interest": readonly number[];
    readonly "onSale": number;
    readonly "startMail": number;
    readonly "endMai": number;
    readonly "noteMail": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type BankDefinitionCatalog = CatalogTable<BankDefinition>;
