export interface WbSkillDefinition {
  readonly "id": number;
  readonly "winningStreak": number;
  readonly "BonusPoints": number;
  readonly "shutDown": number;
  readonly "show": number;
  readonly "robRate": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type WbSkillDefinitionCatalog = CatalogTable<WbSkillDefinition>;
