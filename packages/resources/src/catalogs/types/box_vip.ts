export interface BoxVipDefinition {
  readonly "id": number;
  readonly "vip": number;
  readonly "condition": readonly number[];
  readonly "condRate": number;
  readonly "deplete": number;
  readonly "depleteNum": readonly number[];
  readonly "rate": readonly number[];
  readonly "item": readonly number[];
  readonly "itemNum": readonly number[] | string;
  readonly "noticeItem": number | readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";
export type BoxVipDefinitionCatalog = CatalogTable<BoxVipDefinition>;
