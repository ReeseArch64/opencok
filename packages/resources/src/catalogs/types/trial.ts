export interface TrialDefinition {
  readonly "id": number;
  readonly "hp": number;
  readonly "sequence": number;
  readonly "reward": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type TrialDefinitionCatalog = CatalogTable<TrialDefinition>;
