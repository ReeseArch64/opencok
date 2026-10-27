export interface DeepLinkDefinition {
  readonly "id": number;
  readonly "type": number;
  readonly "name": string;
  readonly "mailId"?: number;
  readonly "number"?: number;
  readonly "rewardId"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type DeepLinkDefinitionCatalog = CatalogTable<DeepLinkDefinition>;
