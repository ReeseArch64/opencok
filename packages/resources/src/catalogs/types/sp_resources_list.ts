export interface SpResourcesListDefinition {
  readonly "id": number;
  readonly "type": number;
  readonly "level": number;
  readonly "refreshID": number;
  readonly "initresvalue": number;
  readonly "rewards": number;
  readonly "max": number;
  readonly "time": number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type SpResourcesListDefinitionCatalog = CatalogTable<SpResourcesListDefinition>;
