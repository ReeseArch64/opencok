export interface RecallDefinition {
  readonly "id": number;
  readonly "k1": string;
  readonly "k2": number;
  readonly "k3": string;
  readonly "k4": string;
  readonly "k5": number;
  readonly "k6": readonly (readonly number[])[];
  readonly "k7": readonly (readonly number[])[];
  readonly "k10": string;
  readonly "k11": number;
  readonly "k12": number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type RecallDefinitionCatalog = CatalogTable<RecallDefinition>;
