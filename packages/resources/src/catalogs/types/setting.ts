export interface SettingDefinition {
  readonly "id": number;
  readonly "name": number;
  readonly "type": number;
  readonly "show": number;
  readonly "gm": number;
  readonly "rank": number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type SettingDefinitionCatalog = CatalogTable<SettingDefinition>;
