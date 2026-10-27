export interface SpResourcesTypeDefinition {
  readonly "id": number;
  readonly "type": number;
  readonly "ratio": number;
  readonly "dialog": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type SpResourcesTypeDefinitionCatalog = CatalogTable<SpResourcesTypeDefinition>;
