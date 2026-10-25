export interface AllianceBuildingSkillDefinition {
  readonly "id": number;
  readonly "status": number;
  readonly "powerLimit": number;
  readonly "consume": number | readonly number[];
  readonly "permission": number | readonly number[];
  readonly "cdTime"?: number;
  readonly "base"?: number | readonly number[];
  readonly "trapTime"?: number;
  readonly "gridCost"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type AllianceBuildingSkillDefinitionCatalog = CatalogTable<AllianceBuildingSkillDefinition>;
