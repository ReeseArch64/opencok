export interface EquipmentRankDefinition {
  readonly "id": number;
  readonly "reward": string;
  readonly "mail": string;
  readonly "startTime": string;
  readonly "endTime": string;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type EquipmentRankDefinitionCatalog = CatalogTable<EquipmentRankDefinition>;
