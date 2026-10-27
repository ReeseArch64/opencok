export interface GeneralAwakenChallengeRewardDefinition {
  readonly "id": number;
  readonly "generalid"?: number;
  readonly "level"?: number;
  readonly "difficulty"?: number;
  readonly "rewardid"?: number;
  readonly "basicRewardid"?: number;
  readonly "skillId"?: number;
  readonly "newSkillId"?: number;
  readonly "condition1"?: number;
  readonly "para1"?: number;
  readonly "itemId"?: number;
  readonly "unlockDesc"?: number;
  readonly "unlockDescPara"?: number;
  readonly "maxProgress"?: number;
  readonly "type"?: number;
  readonly "dialog"?: readonly number[];
  readonly "dialogNum"?: readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type GeneralAwakenChallengeRewardDefinitionCatalog =
  CatalogTable<GeneralAwakenChallengeRewardDefinition>;
