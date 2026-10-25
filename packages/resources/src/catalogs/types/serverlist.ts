export interface ServerlistDefinition {
  readonly "id": number;
  readonly "serverType": number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type ServerlistDefinitionCatalog = CatalogTable<ServerlistDefinition>;
