export interface KingdomBuildingDefinition {
  readonly "id": number;
  readonly "type": number;
  readonly "building"?: number;
  readonly "rallyMaxTroop"?: number;
  readonly "buildingMaxTroop": number;
  readonly "buildSpeadup"?: number;
  readonly "destroySpeedup"?: number;
  readonly "buff": number | readonly number[];
  readonly "conquestPoint"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type KingdomBuildingDefinitionCatalog = CatalogTable<KingdomBuildingDefinition>;
