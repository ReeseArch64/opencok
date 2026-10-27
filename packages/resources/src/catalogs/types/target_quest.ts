export interface TargetQuestDefinition {
  readonly "id": number;
  readonly "rate": number;
  readonly "accept": readonly number[];
  readonly "alliance": number;
  readonly "type": number;
  readonly "extendType": number | readonly number[];
  readonly "quantity": number;
  readonly "rewardall": number;
  readonly "reward10": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type TargetQuestDefinitionCatalog = CatalogTable<TargetQuestDefinition>;
