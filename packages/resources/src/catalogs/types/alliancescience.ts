export interface AlliancescienceDefinition {
  readonly "id": number;
  readonly "scienceLv": number;
  readonly "levelMax": number;
  readonly "power": number;
  readonly "points": number;
  readonly "value": readonly number[];
  readonly "time": number;
  readonly "resource": readonly number[];
  readonly "donate": readonly number[];
  readonly "schedule": number;
  readonly "contribution": number;
  readonly "para1": number | readonly number[];
  readonly "para2": number;
  readonly "name": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type AlliancescienceDefinitionCatalog = CatalogTable<AlliancescienceDefinition>;
