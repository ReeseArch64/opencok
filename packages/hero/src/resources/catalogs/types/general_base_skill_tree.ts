export interface GeneralBaseSkillTreeDefinition {
  readonly "id": number;
  readonly "position": readonly (readonly number[])[];
  readonly "skillId": readonly number[];
  readonly "relationId": readonly (readonly number[])[];
}

import type { CatalogTable } from "@opencok/resources/catalog-model";

export type GeneralBaseSkillTreeDefinitionCatalog = CatalogTable<GeneralBaseSkillTreeDefinition>;
