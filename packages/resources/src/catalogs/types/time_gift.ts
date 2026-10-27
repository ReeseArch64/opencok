export interface TimeGiftDefinition {
  readonly "id": number;
  readonly "level": number;
  readonly "rate": number;
  readonly "reward": readonly (readonly number[])[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type TimeGiftDefinitionCatalog = CatalogTable<TimeGiftDefinition>;
