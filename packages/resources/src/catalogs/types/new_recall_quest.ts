export interface NewRecallQuestDefinition {
  readonly "id": number;
  readonly "time": number;
  readonly "castleLv": readonly number[];
  readonly "type": number;
  readonly "extendType": number | readonly number[];
  readonly "color": number;
  readonly "quantity": number;
  readonly "reward": number;
  readonly "rewardInve": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type NewRecallQuestDefinitionCatalog = CatalogTable<NewRecallQuestDefinition>;
