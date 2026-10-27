export interface SpResourcesInitDefinition {
  readonly "id": number;
  readonly "areaLevel": number;
  readonly "resourceId": number;
  readonly "type": number;
  readonly "ratio"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type SpResourcesInitDefinitionCatalog = CatalogTable<SpResourcesInitDefinition>;
