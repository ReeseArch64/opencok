export interface LordImageDefinition {
  readonly "id": number;
  readonly "name": string;
  readonly "value": number;
  readonly "show": number;
  readonly "rank": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type LordImageDefinitionCatalog = CatalogTable<LordImageDefinition>;
