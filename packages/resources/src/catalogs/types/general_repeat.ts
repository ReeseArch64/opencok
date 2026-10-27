export interface GeneralRepeatDefinition {
  readonly "id": number;
  readonly "generalId": number;
  readonly "consume": readonly number[];
  readonly "quantity": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type GeneralRepeatDefinitionCatalog = CatalogTable<GeneralRepeatDefinition>;
