export interface AbDefinition {
  readonly "id": number;
  readonly "type": number;
  readonly "skill": readonly number[];
  readonly "relation": readonly (readonly number[])[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type AbDefinitionCatalog = CatalogTable<AbDefinition>;
