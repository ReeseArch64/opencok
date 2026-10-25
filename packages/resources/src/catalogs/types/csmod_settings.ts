export interface CsmodSettingsDefinition {
  readonly "id": string;
  readonly "attackPercent": number;
  readonly "attackWins": number;
  readonly "defenceWins": number;
  readonly "honorPoint": number;
  readonly "kill": number;
  readonly "militaryPoint": number;
  readonly "power": number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type CsmodSettingsDefinitionCatalog = CatalogTable<CsmodSettingsDefinition>;
