export interface CharactersDefinition {
  readonly "id": number;
  readonly "name": string;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type CharactersDefinitionCatalog = CatalogTable<CharactersDefinition>;
