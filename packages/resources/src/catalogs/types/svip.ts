export interface SvipDefinition {
  readonly "id": number;
  readonly "point"?: number;
  readonly "heroChallenge": number;
  readonly "effect": readonly (readonly number[])[];
  readonly "woodLimit": number;
  readonly "foodLimit": number;
  readonly "ironLimit": number;
  readonly "silverLimit": number;
  readonly "queueNum": number;
  readonly "superarmyNum": number;
  readonly "dragonSuperArmy": number;
  readonly "expeditionSuperArmy": number;
  readonly "neutralArmy": number;
  readonly "ancientBattlefieldArmy": number;
  readonly "superarmySwitch": number;
  readonly "trainNum": number;
  readonly "spoint"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type SvipDefinitionCatalog = CatalogTable<SvipDefinition>;
