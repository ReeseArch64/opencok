export interface TerritoryEffectDefinition {
  readonly "id": number;
  readonly "k1"?: number | readonly number[];
  readonly "k2"?: readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";
export type TerritoryEffectDefinitionCatalog = CatalogTable<TerritoryEffectDefinition>;
