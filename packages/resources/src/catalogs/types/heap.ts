export interface HeapDefinition {
  readonly "id": number;
  readonly "type": number;
  readonly "level": number;
  readonly "Node": number;
  readonly "Gift": number;
  readonly "importantReward"?: readonly (readonly number[])[] | string;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type HeapDefinitionCatalog = CatalogTable<HeapDefinition>;
