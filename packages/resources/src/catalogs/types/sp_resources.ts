export interface SpResourcesDefinition {
  readonly "id": number;
  readonly "type": number;
  readonly "goods": number;
  readonly "quantity": number;
  readonly "load": number;
  readonly "lifeTime": number;
  readonly "deathTime": number;
  readonly "healRate": number;
  readonly "gatherTime": number;
  readonly "level": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type SpResourcesDefinitionCatalog = CatalogTable<SpResourcesDefinition>;
