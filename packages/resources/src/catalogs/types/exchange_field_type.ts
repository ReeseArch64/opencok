export interface ExchangeFieldTypeDefinition {
  readonly "cnName": string;
  readonly "id": number;
  readonly "tid": number;
  readonly "type": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type ExchangeFieldTypeDefinitionCatalog = CatalogTable<ExchangeFieldTypeDefinition>;
