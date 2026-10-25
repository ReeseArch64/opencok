export interface GeneralDrawDefinition {
  readonly "id": number;
  readonly "library": number;
  readonly "type": number;
  readonly "itemId": number;
  readonly "quantity": number;
  readonly "rate": number;
  readonly "show": number;
  readonly "order": number;
  readonly "isUIShow"?: number;
  readonly "pos"?: number;
  readonly "xOffset"?: number;
  readonly "yOffset"?: number;
  readonly "alpha"?: number | string;
  readonly "divLevel"?: number;
  readonly "scale"?: string;
  readonly "activityType"?: number;
  readonly "startTime"?: number;
  readonly "endTime"?: number;
  readonly "activityId"?: number;
  readonly "isActivityIcon"?: number;
  readonly "para1"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type GeneralDrawDefinitionCatalog = CatalogTable<GeneralDrawDefinition>;
