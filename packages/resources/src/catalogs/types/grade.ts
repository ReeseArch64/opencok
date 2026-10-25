export interface GradeDefinition {
  readonly "id": number;
  readonly "item": readonly number[];
  readonly "cost": number;
  readonly "gAtk": number;
  readonly "gDef": number;
  readonly "skill"?: readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";
export type GradeDefinitionCatalog = CatalogTable<GradeDefinition>;
