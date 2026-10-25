export interface GoldenRouletteDefinition {
  readonly "id": number;
  readonly "minlevel": number;
  readonly "gold": bigint;
  readonly "rate": readonly number[];
  readonly "item": readonly number[];
  readonly "itemNum": readonly number[];
  readonly "noticeItem": readonly number[];
  readonly "important": readonly number[];
  readonly "rewardtype1": readonly (readonly number[])[];
  readonly "rewardtype2": number | readonly number[];
  readonly "rewardtype3": number | readonly number[];
  readonly "adType"?: number;
  readonly "adtypeDialog"?: number;
  readonly "adShow"?: string;
  readonly "index": number;
  readonly "limitlevel"?: number;
  readonly "rewardSendTime"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type GoldenRouletteDefinitionCatalog = CatalogTable<GoldenRouletteDefinition>;
