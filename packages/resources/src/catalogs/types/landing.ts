export interface LandingDefinition {
  readonly "id": number;
  readonly "type": number;
  readonly "gold"?: bigint;
  readonly "rate": number;
  readonly "rate3": number;
  readonly "rate7": number;
  readonly "silver"?: bigint;
  readonly "expcard"?: readonly number[];
  readonly "times"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type LandingDefinitionCatalog = CatalogTable<LandingDefinition>;
