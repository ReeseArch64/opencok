export interface SuitDefinition {
  readonly "id": number;
  readonly "suitPara1": number | readonly number[];
  readonly "suitNum1": number | string;
  readonly "suitPara2": number | readonly number[];
  readonly "suitNum2": number;
  readonly "suitPara3": number | readonly number[];
  readonly "suitNum3": number | string;
  readonly "color": number;
  readonly "forgeRate"?: number;
  readonly "initRate"?: number;
  readonly "exclusiveHero"?: number;
  readonly "reform"?: number;
  readonly "suitHero1"?: number;
  readonly "suitHero2"?: number;
  readonly "suitHero3"?: number;
  readonly "superior"?: number;
  readonly "suitEffect"?: string;
  readonly "suitValue"?: string;
  readonly "suitDialog"?: string;
  readonly "suitValueType"?: string;
  readonly "suitValueSign"?: string;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type SuitDefinitionCatalog = CatalogTable<SuitDefinition>;
