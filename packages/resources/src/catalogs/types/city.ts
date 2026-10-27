export interface CityDefinition {
  readonly "id": number;
  readonly "typeCity"?: number;
  readonly "country"?: number;
  readonly "neighbour"?: readonly (readonly number[])[];
  readonly "numGuard"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type CityDefinitionCatalog = CatalogTable<CityDefinition>;
