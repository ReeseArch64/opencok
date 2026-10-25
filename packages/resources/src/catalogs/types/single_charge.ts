export interface SingleChargeDefinition {
  readonly "id": number;
  readonly "group": number;
  readonly "money": string;
  readonly "reward": number;
  readonly "number": number;
  readonly "times": number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type SingleChargeDefinitionCatalog = CatalogTable<SingleChargeDefinition>;
