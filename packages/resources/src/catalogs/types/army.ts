export interface ArmyDefinition {
  readonly "id": number;
  readonly "arm": readonly (readonly number[])[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type ArmyDefinitionCatalog = CatalogTable<ArmyDefinition>;
