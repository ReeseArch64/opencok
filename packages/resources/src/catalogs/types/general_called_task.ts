export interface GeneralCalledTaskDefinition {
  readonly "id": number;
  readonly "desc": number;
  readonly "goType": number;
  readonly "goItemId": number;
  readonly "tab": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type GeneralCalledTaskDefinitionCatalog = CatalogTable<GeneralCalledTaskDefinition>;
