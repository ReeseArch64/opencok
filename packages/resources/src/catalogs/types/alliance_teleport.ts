export interface AllianceTeleportDefinition {
  readonly "id": number;
  readonly "name": string;
  readonly "type": number;
  readonly "para1": number;
  readonly "functionOn": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type AllianceTeleportDefinitionCatalog = CatalogTable<AllianceTeleportDefinition>;
