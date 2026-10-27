export interface EndowmentDefinition {
  readonly "id": number;
  readonly "levelmax": number;
  readonly "effect": number;
  readonly "value": readonly number[];
  readonly "power": number;
  readonly "mark": number;
  readonly "open"?: readonly (readonly number[])[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type EndowmentDefinitionCatalog = CatalogTable<EndowmentDefinition>;
