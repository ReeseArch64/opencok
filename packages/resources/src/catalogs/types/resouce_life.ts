export interface ResouceLifeDefinition {
  readonly "id": number;
  readonly "level": number;
  readonly "type": number;
  readonly "amount": number;
  readonly "resouceSpeed": number | string;
  readonly "resouceWeight": number;
  readonly "resouceLife": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type ResouceLifeDefinitionCatalog = CatalogTable<ResouceLifeDefinition>;
