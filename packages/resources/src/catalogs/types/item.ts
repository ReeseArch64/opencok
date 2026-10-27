export interface ItemDefinition {
  readonly "id": number | string;
  readonly "k1"?: number | readonly (readonly (readonly (readonly number[])[])[])[] | string;
  readonly "k2"?: number | readonly (readonly (readonly number[])[])[] | string;
  readonly "k3"?: number | readonly (readonly (readonly (readonly number[])[])[])[] | string;
  readonly "k4"?: number | readonly (readonly (readonly number[])[])[] | string;
  readonly "k5"?: number | readonly (readonly number[])[] | string;
  readonly "k6"?: number | readonly (readonly (readonly (readonly number[])[])[])[] | string;
  readonly "k7"?: number | readonly (readonly (readonly number[])[])[] | string;
  readonly "k8"?: number | readonly (readonly (readonly (readonly number[])[])[])[] | string;
  readonly "k9"?: number | readonly (readonly (readonly number[])[])[] | string;
  readonly "k10"?: number | readonly (readonly number[])[] | string;
  readonly "k11"?: number | readonly (readonly (readonly number[])[])[] | string;
  readonly "k12"?: number | readonly (readonly number[])[] | string;
  readonly "k13"?: number | readonly (readonly (readonly number[])[])[] | string;
  readonly "k14"?: number;
  readonly "k15"?: number;
  readonly "k16"?: number | readonly (readonly number[])[];
  readonly "k17"?: number | readonly number[];
  readonly "k18"?: number;
  readonly "k19"?: number;
  readonly "level"?: number;
  readonly "prestige"?: number;
  readonly "enabled"?: number;
  readonly "name"?: string;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type ItemDefinitionCatalog = CatalogTable<ItemDefinition>;
