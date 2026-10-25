export interface WagAreaDefinition {
  readonly "id": number;
  readonly "group": number;
  readonly "name": number;
  readonly "country": string;
  readonly "ip": string;
  readonly "time": readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";
export type WagAreaDefinitionCatalog = CatalogTable<WagAreaDefinition>;
