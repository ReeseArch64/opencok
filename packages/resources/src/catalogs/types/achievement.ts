export interface AchievementDefinition {
  readonly "id": number;
  readonly "series": number;
  readonly "show": number;
  readonly "aim": number;
  readonly "para1": number;
  readonly "para2"?: number | readonly number[] | string;
  readonly "reward": number;
  readonly "medal": number;
  readonly "medalLevel": number;
  readonly "start"?: string;
  readonly "end"?: string;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type AchievementDefinitionCatalog = CatalogTable<AchievementDefinition>;
