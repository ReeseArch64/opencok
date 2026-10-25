export interface HeroRouletteDefinition {
  readonly "id": number;
  readonly "minlevel": number;
  readonly "gold"?: bigint;
  readonly "rate": readonly (readonly number[])[];
  readonly "item": readonly number[];
  readonly "itemNum": readonly number[] | string;
  readonly "noticeItem"?: readonly number[] | string;
  readonly "important": readonly number[];
  readonly "quality": readonly number[];
  readonly "name"?: number;
  readonly "day"?: number;
  readonly "itemType"?: readonly number[];
  readonly "costItemId"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type HeroRouletteDefinitionCatalog = CatalogTable<HeroRouletteDefinition>;
