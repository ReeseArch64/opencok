export interface SagaTowerScienceBaseDefinition {
  readonly "id": number;
  readonly "book": number;
  readonly "chapter": number;
  readonly "bookIcon": string;
  readonly "bookName": number;
  readonly "chapterName": number;
  readonly "scienceName": number | readonly number[];
  readonly "description": number;
  readonly "icon": number | string;
  readonly "position": readonly number[];
  readonly "relation"?: number | readonly number[];
  readonly "show"?: number;
  readonly "levelMax": number;
  readonly "hide": number;
  readonly "power": number | readonly number[];
  readonly "stats": number | readonly (readonly number[])[] | string;
  readonly "showType"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type SagaTowerScienceBaseDefinitionCatalog = CatalogTable<SagaTowerScienceBaseDefinition>;
