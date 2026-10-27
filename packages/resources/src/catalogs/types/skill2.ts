export interface Skill2Definition {
  readonly "id": number;
  readonly "levelMax": number;
  readonly "type": number;
  readonly "para1": number | readonly number[];
  readonly "conditionSkill"?: readonly (readonly number[])[];
  readonly "conditionPoint"?: number;
  readonly "base"?: number | readonly number[] | string;
  readonly "add"?: number | readonly number[] | string;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type Skill2DefinitionCatalog = CatalogTable<Skill2Definition>;
