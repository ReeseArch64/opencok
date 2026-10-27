export interface AbilityDefinition {
  readonly "id": number;
  readonly "level": number;
  readonly "type": number;
  readonly "class": number;
  readonly "skill": readonly number[];
  readonly "relation": readonly (readonly number[])[];
  readonly "rate": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type AbilityDefinitionCatalog = CatalogTable<AbilityDefinition>;
