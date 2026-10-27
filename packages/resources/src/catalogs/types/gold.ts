export interface GoldDefinition {
  readonly "id": number;
  readonly "country": string;
  readonly "gold1": number;
  readonly "gold2": number;
  readonly "gold3": number;
  readonly "gold4": number;
  readonly "gold5": number;
  readonly "gold8": number;
  readonly "gold6": number;
  readonly "code"?: string;
  readonly "Money": string;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type GoldDefinitionCatalog = CatalogTable<GoldDefinition>;
