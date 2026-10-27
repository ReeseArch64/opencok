export interface Drconfig7260Definition {
  readonly "id": number;
  readonly "name": string;
  readonly "checksize": number;
  readonly "iosmd5": string;
  readonly "androidmd5": string;
  readonly "version": string;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type Drconfig7260DefinitionCatalog = CatalogTable<Drconfig7260Definition>;
