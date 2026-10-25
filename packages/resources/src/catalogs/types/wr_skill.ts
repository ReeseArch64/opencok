export interface WrSkillDefinition {
  readonly "id": number;
  readonly "level": number;
  readonly "group": number;
  readonly "preSkill": number;
  readonly "status": number;
  readonly "costTpye": number;
  readonly "costValue": number;
  readonly "needLevel": number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type WrSkillDefinitionCatalog = CatalogTable<WrSkillDefinition>;
