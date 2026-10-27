export interface LordDetailsDefinition {
  readonly "id": number;
  readonly "where"?: string;
  readonly "effect": number | readonly (readonly number[])[] | string;
  readonly "value"?: number;
  readonly "show"?: number | readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type LordDetailsDefinitionCatalog = CatalogTable<LordDetailsDefinition>;
