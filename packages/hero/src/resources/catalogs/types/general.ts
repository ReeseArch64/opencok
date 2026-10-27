export interface GeneralDefinition {
  readonly "id": number;
  readonly "attack": number;
  readonly "defence": number;
  readonly "color"?: number;
  readonly "power"?: number;
  readonly "talent"?: number;
  readonly "ability"?: number;
}

import type { CatalogTable } from "@opencok/resources/catalog-model";

export type GeneralDefinitionCatalog = CatalogTable<GeneralDefinition>;
