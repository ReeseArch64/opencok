export interface ActionDefinition {
  readonly "id": string;
  readonly "lvLimit1": number;
  readonly "count1": number;
  readonly "count": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type ActionDefinitionCatalog = CatalogTable<ActionDefinition>;
