export interface NpcDefinition {
  readonly "id": number;
  readonly "position": readonly number[];
  readonly "fbType": number;
  readonly "armyId"?: number;
  readonly "experience"?: number;
  readonly "wood": bigint;
  readonly "food"?: bigint;
  readonly "silver"?: bigint;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type NpcDefinitionCatalog = CatalogTable<NpcDefinition>;
