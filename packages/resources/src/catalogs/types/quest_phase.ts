export interface QuestPhaseDefinition {
  readonly "id": number;
  readonly "para1": number;
  readonly "reward": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type QuestPhaseDefinitionCatalog = CatalogTable<QuestPhaseDefinition>;
