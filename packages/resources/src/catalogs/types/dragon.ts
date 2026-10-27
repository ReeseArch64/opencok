export interface DragonDefinition {
  readonly "id": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type DragonDefinitionCatalog = CatalogTable<DragonDefinition>;
