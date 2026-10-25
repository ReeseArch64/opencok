export interface WkBuildDefinition {
  readonly "id": number;
  readonly "level": number;
  readonly "winNum": number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type WkBuildDefinitionCatalog = CatalogTable<WkBuildDefinition>;
