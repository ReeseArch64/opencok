export interface HotgoodsDefinition {
  readonly "id": number;
  readonly "condition": readonly number[] | string;
  readonly "order": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type HotgoodsDefinitionCatalog = CatalogTable<HotgoodsDefinition>;
