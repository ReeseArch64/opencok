export interface RecruitDefinition {
  readonly "id": number;
  readonly "cost": number;
  readonly "white": number;
  readonly "green": number;
  readonly "blue": number;
  readonly "violet": number;
  readonly "safety1"?: number;
  readonly "safety2"?: readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type RecruitDefinitionCatalog = CatalogTable<RecruitDefinition>;
