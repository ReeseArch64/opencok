export interface PayRewardDefinition {
  readonly "id": number;
  readonly "gold"?: bigint;
  readonly "rate": readonly (readonly number[])[];
  readonly "item": readonly (readonly number[])[];
  readonly "quantity": readonly (readonly number[])[];
  readonly "circle": number | readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type PayRewardDefinitionCatalog = CatalogTable<PayRewardDefinition>;
