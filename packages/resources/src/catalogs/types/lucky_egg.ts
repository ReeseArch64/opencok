export interface LuckyEggDefinition {
  readonly "id": number;
  readonly "rewards": number;
  readonly "needItem": number;
  readonly "needNum": number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type LuckyEggDefinitionCatalog = CatalogTable<LuckyEggDefinition>;
