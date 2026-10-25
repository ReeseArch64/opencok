export interface RoleDefinition {
  readonly "id": number;
  readonly "playerExperience"?: number;
  readonly "generalExperience"?: number;
  readonly "endowment"?: number;
  readonly "giftExperience"?: number;
  readonly "power"?: number;
  readonly "levelRewardId"?: number;
  readonly "levelItem"?: readonly number[];
  readonly "levelNum"?: readonly number[];
  readonly "storage"?: number;
  readonly "content"?: number;
  readonly "queueUnlock"?: readonly number[];
  readonly "stamina": number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type RoleDefinitionCatalog = CatalogTable<RoleDefinition>;
