export interface GeneralRandomEffectDefinition {
  readonly "id": number;
  readonly "generalId": number;
  readonly "effect": number | readonly number[];
  readonly "max": number;
  readonly "rate": number;
  readonly "name": number;
  readonly "show": number;
  readonly "buff": number;
  readonly "good"?: number;
}

import type { CatalogTable } from "@opencok/resources/catalog-model";

export type GeneralRandomEffectDefinitionCatalog = CatalogTable<GeneralRandomEffectDefinition>;
