export interface NewSprInfoDefinition {
  readonly "id": number;
  readonly "multi": number;
  readonly "resource": readonly (readonly number[])[];
  readonly "reward": number;
  readonly "time": number;
  readonly "deadrate": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type NewSprInfoDefinitionCatalog = CatalogTable<NewSprInfoDefinition>;
