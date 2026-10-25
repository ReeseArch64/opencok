export interface QuestMarkDefinition {
  readonly "quest": string;
  readonly "id": number;
  readonly "order": number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type QuestMarkDefinitionCatalog = CatalogTable<QuestMarkDefinition>;
