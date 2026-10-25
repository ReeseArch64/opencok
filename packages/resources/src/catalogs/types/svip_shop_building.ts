export interface SvipShopBuildingDefinition {
  readonly "id": number;
  readonly "level": number;
  readonly "experience": number;
  readonly "nextExp": number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type SvipShopBuildingDefinitionCatalog = CatalogTable<SvipShopBuildingDefinition>;
