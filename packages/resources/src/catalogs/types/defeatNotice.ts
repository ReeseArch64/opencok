export interface DefeatNoticeDefinition {
  readonly "id": number;
  readonly "type": number;
  readonly "object": number;
  readonly "mp"?: number;
  readonly "effect"?: readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type DefeatNoticeDefinitionCatalog = CatalogTable<DefeatNoticeDefinition>;
