export interface AllianceMissionDefinition {
  readonly "id": number;
  readonly "quality": number;
  readonly "type": number;
  readonly "type2": number;
  readonly "para2": readonly number[];
  readonly "reward": readonly number[];
  readonly "position": number;
  readonly "rate": number;
  readonly "request"?: readonly number[];
  readonly "para1"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type AllianceMissionDefinitionCatalog = CatalogTable<AllianceMissionDefinition>;
