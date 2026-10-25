export interface DailyQuestDefinition {
  readonly "id": number;
  readonly "accept1": number;
  readonly "type1": number;
  readonly "para1": number | readonly number[];
  readonly "para2": number;
  readonly "para3": number;
  readonly "point": number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type DailyQuestDefinitionCatalog = CatalogTable<DailyQuestDefinition>;
