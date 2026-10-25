export interface DrawRandomDefinition {
  readonly "id": number;
  readonly "type": number;
  readonly "dialog": number;
  readonly "sign": number;
  readonly "percent": number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type DrawRandomDefinitionCatalog = CatalogTable<DrawRandomDefinition>;
