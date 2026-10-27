export interface PositionDefinition {
  readonly "id": number;
  readonly "default"?: number;
  readonly "position": number;
  readonly "building": number | readonly number[];
  readonly "unlock"?: number;
  readonly "hide"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type PositionDefinitionCatalog = CatalogTable<PositionDefinition>;
