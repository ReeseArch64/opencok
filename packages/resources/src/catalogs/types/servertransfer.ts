export interface ServertransferDefinition {
  readonly "id": number;
  readonly "serverlist": readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";
export type ServertransferDefinitionCatalog = CatalogTable<ServertransferDefinition>;
