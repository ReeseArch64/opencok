export interface LuckyEffectDefinition {
  readonly "id": number;
  readonly "effect": readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type LuckyEffectDefinitionCatalog = CatalogTable<LuckyEffectDefinition>;
