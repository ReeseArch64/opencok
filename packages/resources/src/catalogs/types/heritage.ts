export interface HeritageDefinition {
  readonly "id": number;
  readonly "time": number;
  readonly "roll": number;
  readonly "rangmin": number;
  readonly "rangmax": number;
  readonly "lvlmin": number;
  readonly "lvlmax": number;
  readonly "reward": number;
  readonly "colour": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type HeritageDefinitionCatalog = CatalogTable<HeritageDefinition>;
