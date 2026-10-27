export interface WkQuestDefinition {
  readonly "id": number;
  readonly "type": number;
  readonly "reward"?: readonly (readonly number[])[];
  readonly "rate"?: number;
  readonly "quantity"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type WkQuestDefinitionCatalog = CatalogTable<WkQuestDefinition>;
