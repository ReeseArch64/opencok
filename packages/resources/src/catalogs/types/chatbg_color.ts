export interface ChatbgColorDefinition
{
    readonly "id": number;
    readonly "chatbgId": number;
    readonly "color": readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type ChatbgColorDefinitionCatalog = CatalogTable<ChatbgColorDefinition>;
