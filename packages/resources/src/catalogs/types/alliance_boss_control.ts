export interface AllianceBossControlDefinition {
  readonly "id": number;
  readonly "openday": readonly number[];
  readonly "bossid": readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type AllianceBossControlDefinitionCatalog = CatalogTable<AllianceBossControlDefinition>;
