export interface PackageDefinition {
  readonly "id": number;
  readonly "name": string;
  readonly "md5": string;
  readonly "pf": string;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type PackageDefinitionCatalog = CatalogTable<PackageDefinition>;
