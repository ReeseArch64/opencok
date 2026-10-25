export interface LuckDrawDefinition {
  readonly "id": number;
  readonly "type": number;
  readonly "reward"?: number;
  readonly "rate": number;
  readonly "color": number;
  readonly "buff"?: number;
  readonly "luckyRound"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type LuckDrawDefinitionCatalog = CatalogTable<LuckDrawDefinition>;
