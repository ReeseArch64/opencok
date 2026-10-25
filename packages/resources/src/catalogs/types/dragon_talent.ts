export interface DragonTalentDefinition {
  readonly "id": number;
  readonly "name": number;
  readonly "desc": number;
  readonly "description": number;
  readonly "param": number;
  readonly "isper": number;
  readonly "icon": string;
  readonly "dragonId": number;
  readonly "skillid": number;
  readonly "postion": readonly number[];
  readonly "relation": readonly (readonly number[])[];
  readonly "level": number;
  readonly "maxlevel": number;
  readonly "talentCondition"?: number | readonly number[];
  readonly "skillType"?: number;
  readonly "extSkill"?: readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";
export type DragonTalentDefinitionCatalog = CatalogTable<DragonTalentDefinition>;
