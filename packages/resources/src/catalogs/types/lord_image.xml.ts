export interface LordImageXmlDefinition
{
    readonly "id": number;
    readonly "test": string;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type LordImageXmlDefinitionCatalog = CatalogTable<LordImageXmlDefinition>;
