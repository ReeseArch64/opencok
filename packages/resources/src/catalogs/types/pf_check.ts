export interface PfCheckDefinition {
  readonly "id": number;
  readonly "name": string;
  readonly "dialog": string;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type PfCheckDefinitionCatalog = CatalogTable<PfCheckDefinition>;
