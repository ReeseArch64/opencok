export interface GeneralDrawNewMainDefinition {
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

import type { CatalogTable } from "@opencok/resources/catalog-model";

export type GeneralDrawNewMainDefinitionCatalog = CatalogTable<GeneralDrawNewMainDefinition>;
