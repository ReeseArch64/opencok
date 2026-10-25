export interface QuestDefinition {
  readonly "id": number;
  readonly "accept1": number;
  readonly "accept2": number;
  readonly "default"?: number;
  readonly "type1": number;
  readonly "type2": number;
  readonly "para1"?: number;
  readonly "para2": number;
  readonly "reward"?: number;
  readonly "type": number;
  readonly "Order"?: number;
  readonly "pos1": number;
  readonly "pre"?: number;
  readonly "order2"?: number;
  readonly "add"?: number;
  readonly "accept3"?: number;
  readonly "orderTrain"?: number;
  readonly "ignore"?: number;
  readonly "operator"?: string;
  readonly "phase"?: number;
  readonly "min"?: number;
  readonly "max"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type QuestDefinitionCatalog = CatalogTable<QuestDefinition>;
