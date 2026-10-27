export interface WrExpDefinition {
  readonly "id": number;
  readonly "min": number;
  readonly "max": number;
  readonly "experience": number;
  readonly "reward": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type WrExpDefinitionCatalog = CatalogTable<WrExpDefinition>;
