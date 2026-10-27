export interface NeutralServerBuildingDefinition {
  readonly "id": number;
  readonly "type": number;
  readonly "pointType": number;
  readonly "x": number;
  readonly "y": number;
  readonly "base"?: readonly (readonly number[])[];
  readonly "science"?: number;
  readonly "army"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type NeutralServerBuildingDefinitionCatalog = CatalogTable<NeutralServerBuildingDefinition>;
