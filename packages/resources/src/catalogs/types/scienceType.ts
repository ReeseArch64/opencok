export interface ScienceTypeDefinition {
  readonly "id": number;
  readonly "name": number;
  readonly "position": number;
  readonly "icon": string;
  readonly "science": readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";
export type ScienceTypeDefinitionCatalog = CatalogTable<ScienceTypeDefinition>;
