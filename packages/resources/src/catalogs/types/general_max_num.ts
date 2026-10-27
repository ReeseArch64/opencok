export interface GeneralMaxNumDefinition {
  readonly "id": number;
  readonly "generalId": number;
  readonly "consume": readonly number[];
  readonly "maxNum": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type GeneralMaxNumDefinitionCatalog = CatalogTable<GeneralMaxNumDefinition>;
