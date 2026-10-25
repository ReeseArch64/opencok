export interface EggDefinition {
  readonly "id": number;
  readonly "time": number;
  readonly "cost": number;
  readonly "reward": number;
  readonly "expFinish": number;
  readonly "experience": number;
  readonly "full": number;
  readonly "dark": readonly number[];
  readonly "questionMark": readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";
export type EggDefinitionCatalog = CatalogTable<EggDefinition>;
