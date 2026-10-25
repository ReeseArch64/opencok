export interface P6ArmsDefinition {
  readonly "id": number;
  readonly "experience": number;
  readonly "item": number;
  readonly "expAdd": number;
  readonly "effect"?: number | readonly (readonly number[])[];
  readonly "skill"?: number;
  readonly "status"?: number | readonly number[];
  readonly "quantity"?: number | readonly (readonly number[])[] | string;
  readonly "name"?: number;
  readonly "levelMax"?: number;
  readonly "kill"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type P6ArmsDefinitionCatalog = CatalogTable<P6ArmsDefinition>;
