export interface MagicRushDefinition {
  readonly "id": number;
  readonly "k1": string;
  readonly "k2": string;
  readonly "k3": string;
  readonly "k5": number;
  readonly "k6": number;
  readonly "k7": number;
  readonly "k8": number;
  readonly "k9": number;
  readonly "k10": number;
  readonly "k11": string;
  readonly "k12": string;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type MagicRushDefinitionCatalog = CatalogTable<MagicRushDefinition>;
