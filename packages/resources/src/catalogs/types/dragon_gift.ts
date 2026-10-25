export interface DragonGiftDefinition {
  readonly "id": number;
  readonly "dragonCfg": readonly number[];
  readonly "blackId": number;
  readonly "blueId": number;
  readonly "addPic": string;
  readonly "ver": number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type DragonGiftDefinitionCatalog = CatalogTable<DragonGiftDefinition>;
