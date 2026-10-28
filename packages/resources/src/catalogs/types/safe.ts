export interface SafeDefinition
{
    readonly "id": string;
    readonly "ios": string;
    readonly "android": string;
    readonly "para": string;
    readonly "open": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type SafeDefinitionCatalog = CatalogTable<SafeDefinition>;
