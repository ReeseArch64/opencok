export interface GeneralSkillDefinition {
  readonly "id": number;
  readonly "skillType": number;
  readonly "name"?: number;
  readonly "description"?: number;
  readonly "description1"?: number;
  readonly "icon"?: number | readonly (readonly number[])[] | string;
  readonly "levelMax"?: number;
  readonly "type"?: number;
  readonly "para1"?: number | readonly (readonly number[])[];
  readonly "typeValue"?: number;
  readonly "base"?: number | readonly number[] | string;
  readonly "add"?: number | readonly number[] | string;
  readonly "item"?: number | readonly (readonly number[])[];
  readonly "quantity"?: number | readonly (readonly number[])[];
  readonly "sign"?: number;
  readonly "general"?: number;
  readonly "cdTime"?: number | string;
  readonly "cdtimeEffect"?: number;
  readonly "canBatchUse"?: number;
  readonly "description1Duration"?: number | string;
  readonly "subSkillUnlockItem"?: readonly number[];
  readonly "conditionSkill"?: readonly (readonly number[])[] | string;
  readonly "skillGroup"?: number;
  readonly "class"?: number;
  readonly "generalAb"?: number;
  readonly "learnLv"?: number;
  readonly "where"?: number | string;
  readonly "hideProgressBar"?: number;
  readonly "desNew"?: number;
  readonly "desNewValue"?: readonly (readonly number[])[];
  readonly "conditionAwakenLevel"?: number;
  readonly "frame"?: string;
  readonly "replace"?: number | readonly number[];
  readonly "baseEffect"?: number;
  readonly "statusTime"?: number;
  readonly "reportShow"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type GeneralSkillDefinitionCatalog = CatalogTable<GeneralSkillDefinition>;
