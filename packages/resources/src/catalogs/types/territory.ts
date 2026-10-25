export interface TerritoryDefinition {
  readonly "id": number;
  readonly "condition1": number;
  readonly "condition2": number;
  readonly "towermunberAdd": number;
  readonly "condition3"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type TerritoryDefinitionCatalog = CatalogTable<TerritoryDefinition>;
