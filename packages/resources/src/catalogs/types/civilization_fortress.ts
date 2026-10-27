export interface CivilizationFortressDefinition {
  readonly "id": number;
  readonly "level": number;
  readonly "wood": bigint;
  readonly "iron": bigint;
  readonly "integral": number;
  readonly "time": number;
  readonly "basicOutput": number;
  readonly "valueF": number;
  readonly "plunderTimes": number;
  readonly "plunderNumber": number;
  readonly "yieldCoefficient": number;
  readonly "reduceF": number;
  readonly "garrisonQuantity": number;
  readonly "predatoryRatio": number;
  readonly "storageCeiling": number;
  readonly "soldierMax": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type CivilizationFortressDefinitionCatalog = CatalogTable<CivilizationFortressDefinition>;
