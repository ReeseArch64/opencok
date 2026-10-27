export interface WorldbossDefinition {
  readonly "id": number;
  readonly "army"?: number;
  readonly "maxhp": number;
  readonly "firerange": number;
  readonly "firespeed": number;
  readonly "rewards": readonly (readonly number[])[] | string;
  readonly "killrewards": number;
  readonly "rankrewards"?: readonly number[] | string;
  readonly "k1": number | string;
  readonly "k2": number;
  readonly "costitem"?: readonly number[];
  readonly "crit"?: readonly (readonly number[])[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type WorldbossDefinitionCatalog = CatalogTable<WorldbossDefinition>;
