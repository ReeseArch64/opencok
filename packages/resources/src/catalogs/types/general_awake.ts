export interface GeneralAwakeDefinition {
  readonly "id": number;
  readonly "generalId": number;
  readonly "show": number;
  readonly "awakeLevel": number;
  readonly "conditionLevel": number;
  readonly "awakeBenefitDesc"?: readonly number[];
  readonly "costItem": readonly number[];
  readonly "awakeItem": number;
  readonly "awakenName": number;
  readonly "maxLevelAwaken"?: number;
  readonly "awakenStory"?: number;
  readonly "awakeSkin": number;
  readonly "awakeBg"?: string;
  readonly "awakeSpine"?: string;
  readonly "awakeAdPic"?: string;
  readonly "awakeAdCountdown"?: number;
  readonly "exchangeId"?: number;
  readonly "awakeAdDesc"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type GeneralAwakeDefinitionCatalog = CatalogTable<GeneralAwakeDefinition>;
