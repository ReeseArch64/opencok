export interface QuickScienceDefinition {
  readonly "id": number;
  readonly "groupid": number;
  readonly "scienceid": number;
  readonly "Targetlv": number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type QuickScienceDefinitionCatalog = CatalogTable<QuickScienceDefinition>;
