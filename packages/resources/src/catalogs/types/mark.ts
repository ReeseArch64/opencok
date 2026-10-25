export interface MarkDefinition {
  readonly "what": string;
  readonly "id": number;
  readonly "item": number;
  readonly "doing"?: string;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type MarkDefinitionCatalog = CatalogTable<MarkDefinition>;
