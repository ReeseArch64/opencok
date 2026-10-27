export interface NewSprRoundDefinition {
  readonly "id": number;
  readonly "min": number;
  readonly "max": number;
  readonly "target": readonly (readonly number[])[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type NewSprRoundDefinitionCatalog = CatalogTable<NewSprRoundDefinition>;
