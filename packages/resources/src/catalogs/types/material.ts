export interface MaterialDefinition {
  readonly "id": number;
  readonly "target": readonly (readonly number[])[];
  readonly "material": readonly (readonly number[])[];
}

import type { CatalogTable } from "../../catalog-model.ts";
export type MaterialDefinitionCatalog = CatalogTable<MaterialDefinition>;
