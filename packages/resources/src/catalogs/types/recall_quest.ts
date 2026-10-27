export interface RecallQuestDefinition {
  readonly "id": number;
  readonly "type": number;
  readonly "extendType": number;
  readonly "quantity": number;
  readonly "rewardall": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type RecallQuestDefinitionCatalog = CatalogTable<RecallQuestDefinition>;
