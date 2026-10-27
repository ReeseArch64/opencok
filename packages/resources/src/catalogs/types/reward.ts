export interface RewardDefinition {
  readonly "id": number;
  readonly "islink"?: number;
  readonly "rate"?: number | readonly (readonly number[])[];
  readonly "item"?: number | readonly (readonly number[])[] | string;
  readonly "quantity"?: number | readonly (readonly number[])[] | string;
  readonly "circle"?: number | readonly number[];
  readonly "gold"?: bigint;
  readonly "wood"?: bigint;
  readonly "food"?: bigint;
  readonly "resType"?: number;
  readonly "iron"?: bigint;
  readonly "stone"?: bigint;
  readonly "honor"?: number;
  readonly "alliancePoint"?: number;
  readonly "rewardrule1"?: readonly (readonly number[])[] | string;
  readonly "degression"?: readonly (readonly (readonly number[])[])[];
  readonly "country"?: string;
  readonly "rewardrule2"?: readonly (readonly number[])[] | string;
  readonly "rewardLink"?: number;
  readonly "casino"?: number;
  readonly "goldCasino"?: number;
  readonly "silver"?: bigint;
  readonly "experience"?: number;
  readonly "crystal"?: number;
  readonly "military"?: number;
  readonly "milhonor"?: number;
  readonly "wbskill"?: number;
  readonly "resourceRate"?: readonly (readonly number[])[];
  readonly "material"?: number;
  readonly "dropedTimes"?: number;
  readonly "sandstone"?: number;
  readonly "diamondstone"?: number;
  readonly "marble"?: number;
  readonly "granite"?: number;
  readonly "limestone"?: number;
  readonly "prestige"?: readonly (readonly number[])[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type RewardDefinitionCatalog = CatalogTable<RewardDefinition>;
