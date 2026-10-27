export interface NewBankDefinition {
  readonly "id": number;
  readonly "time": number;
  readonly "rate": number;
  readonly "min": number;
  readonly "max": number;
  readonly "minCastle": number;
  readonly "maxCastle": number;
  readonly "paygold": number;
  readonly "limit": number;
  readonly "online": string;
  readonly "test": string;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type NewBankDefinitionCatalog = CatalogTable<NewBankDefinition>;
