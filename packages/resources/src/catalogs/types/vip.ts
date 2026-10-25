export interface VipDefinition {
  readonly "id": number;
  readonly "point": number;
  readonly "speedup": number;
  readonly "heroChallenge": number;
  readonly "woodLimit": number;
  readonly "foodLimit": number;
  readonly "ironLimit": number;
  readonly "silverLimit": number;
  readonly "effect": readonly (readonly number[])[];
}

import type { CatalogTable } from "../../catalog-model.ts";
export type VipDefinitionCatalog = CatalogTable<VipDefinition>;
