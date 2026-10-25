export interface WagRoleDefinition {
  readonly "id": number;
  readonly "type": number;
  readonly "buildId"?: number;
  readonly "pos"?: number;
  readonly "buildLevel"?: number;
  readonly "buildStar"?: number;
  readonly "roleLv"?: number;
  readonly "posunlock"?: readonly number[];
  readonly "armyId"?: number;
  readonly "armyNum"?: number;
  readonly "itemId"?: number;
  readonly "itemNum"?: number;
  readonly "hero"?: number;
  readonly "heroLv"?: number;
  readonly "equipmentId"?: number;
  readonly "equipmentNum"?: number;
  readonly "dragon"?: number;
  readonly "dragonLv"?: number;
  readonly "vip"?: number;
  readonly "vipLast"?: number;
  readonly "score"?: number;
  readonly "spoint"?: number;
  readonly "scienceId"?: number;
  readonly "scienceLv"?: number;
  readonly "sScience"?: number;
  readonly "sSciencelv"?: number;
  readonly "food"?: bigint;
  readonly "wood"?: bigint;
  readonly "iron"?: bigint;
  readonly "stone"?: bigint;
  readonly "gold"?: bigint;
  readonly "aScience"?: number;
  readonly "aSciencelv"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type WagRoleDefinitionCatalog = CatalogTable<WagRoleDefinition>;
