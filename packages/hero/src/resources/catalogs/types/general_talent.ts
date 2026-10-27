export interface GeneralTalentDefinition {
  readonly "id": number;
  readonly "levelMax": number;
  readonly "type": number;
  readonly "para1"?: number | readonly (readonly number[])[];
  readonly "base"?: number | readonly number[] | string;
  readonly "add"?: number | readonly number[] | string;
  readonly "skillGroup": number;
  readonly "class": number;
  readonly "conditionSkill"?: readonly (readonly number[])[];
  readonly "cdTime"?: number;
  readonly "item"?: number;
  readonly "quantity"?: number;
  readonly "para2"?: number;
  readonly "duration"?: number;
  readonly "name"?: number;
  readonly "description"?: number;
  readonly "icon"?: string;
  readonly "source"?: number;
  readonly "activeskillType"?: number;
  readonly "activeskillIndex"?: number;
  readonly "canBatchUse"?: number;
  readonly "typeValue"?: number;
  readonly "descNumPercent"?: number;
}

import type { CatalogTable } from "@opencok/resources/catalog-model";

export type GeneralTalentDefinitionCatalog = CatalogTable<GeneralTalentDefinition>;
