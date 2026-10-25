export interface LifeTreeSDefinition {
  readonly "id": number;
  readonly "buff": readonly number[];
  readonly "skinExp": number;
  readonly "time": number;
  readonly "resouceType": number;
  readonly "resourceSkinExp": number;
  readonly "goldSkinExp": number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type LifeTreeSDefinitionCatalog = CatalogTable<LifeTreeSDefinition>;
