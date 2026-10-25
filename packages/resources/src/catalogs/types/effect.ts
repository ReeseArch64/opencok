export interface EffectDefinition {
  readonly "id": number;
  readonly "arm18"?: number;
  readonly "arm1"?: number | string;
  readonly "arm2"?: number | string;
  readonly "arm3"?: number | string;
  readonly "arm4"?: number | string;
  readonly "arm5"?: number | string;
  readonly "arm6"?: number | string;
  readonly "arm7"?: number | string;
  readonly "arm8"?: number | string;
  readonly "arm100"?: number;
  readonly "arm101"?: number | string;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type EffectDefinitionCatalog = CatalogTable<EffectDefinition>;
