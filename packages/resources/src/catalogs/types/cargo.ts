export interface CargoDefinition {
  readonly "id": number;
  readonly "castleLV": number;
  readonly "rewardID": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type CargoDefinitionCatalog = CatalogTable<CargoDefinition>;
