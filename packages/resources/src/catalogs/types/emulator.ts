export interface EmulatorDefinition {
  readonly "id": number;
  readonly "name": string;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type EmulatorDefinitionCatalog = CatalogTable<EmulatorDefinition>;
