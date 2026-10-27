export interface ResdentialDefinition {
  readonly "id": number;
  readonly "areaId": readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type ResdentialDefinitionCatalog = CatalogTable<ResdentialDefinition>;
