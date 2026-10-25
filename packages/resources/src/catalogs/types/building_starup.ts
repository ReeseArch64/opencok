export interface BuildingStarupDefinition {
  readonly "id": number;
  readonly "type": number;
  readonly "buildId": number;
  readonly "pos": number;
  readonly "buildLevel": number;
  readonly "buildStar"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type BuildingStarupDefinitionCatalog = CatalogTable<BuildingStarupDefinition>;
