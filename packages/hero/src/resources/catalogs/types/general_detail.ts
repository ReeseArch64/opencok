export interface GeneralDetailDefinition {
  readonly "id": number;
  readonly "name": number;
  readonly "effect": number | readonly (readonly number[])[];
  readonly "show": number;
  readonly "buff": number;
  readonly "order": number;
}

import type { CatalogTable } from "@opencok/resources/catalog-model";

export type GeneralDetailDefinitionCatalog = CatalogTable<GeneralDetailDefinition>;
