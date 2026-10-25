export interface PayServercontrolDefinition {
  readonly "id": number;
  readonly "k1": number | string;
  readonly "k2"?: number | readonly number[] | string;
  readonly "k3"?: number | readonly (readonly (readonly number[])[])[] | string;
  readonly "k4"?: number | readonly number[];
  readonly "k5"?: number | readonly number[] | string;
  readonly "k6"?: number | string;
  readonly "k7"?: number | string;
  readonly "k8"?: number | string;
  readonly "k9"?: number | string;
  readonly "k72"?: number;
  readonly "k107"?: number;
  readonly "k10"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type PayServercontrolDefinitionCatalog = CatalogTable<PayServercontrolDefinition>;
