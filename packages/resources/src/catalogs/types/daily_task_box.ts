export interface DailyTaskBoxDefinition {
  readonly "id": number;
  readonly "minLevel": number;
  readonly "levelMax": number;
  readonly "weight": number;
  readonly "reward": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type DailyTaskBoxDefinitionCatalog = CatalogTable<DailyTaskBoxDefinition>;
