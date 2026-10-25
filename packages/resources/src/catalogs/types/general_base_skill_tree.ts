export interface GeneralBaseSkillTreeDefinition {
  readonly "id": number;
  readonly "position": readonly (readonly number[])[];
  readonly "skillId": readonly number[];
  readonly "relationId": readonly (readonly number[])[];
}

import type { CatalogTable } from "../../catalog-model.ts";
export type GeneralBaseSkillTreeDefinitionCatalog = CatalogTable<GeneralBaseSkillTreeDefinition>;
