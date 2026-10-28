export interface SpecialPushDefinition
{
    readonly "id": number;
    readonly "type": number;
    readonly "premise": number;
    readonly "time": number;
    readonly "number": number;
    readonly "action": number;
    readonly "function": number;
    readonly "dialog": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type SpecialPushDefinitionCatalog = CatalogTable<SpecialPushDefinition>;
