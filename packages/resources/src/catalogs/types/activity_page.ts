export interface ActivityPageDefinition {
  readonly "id": number;
  readonly "Type": number;
  readonly "callActivity": number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type ActivityPageDefinitionCatalog = CatalogTable<ActivityPageDefinition>;
