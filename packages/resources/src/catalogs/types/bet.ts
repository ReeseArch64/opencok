export interface BetDefinition {
  readonly "id": number;
  readonly "start": string;
  readonly "end": string;
  readonly "type": number;
  readonly "basic": number;
  readonly "limit": number;
  readonly "limit1": number;
  readonly "rate": number;
  readonly "cheat": number;
  readonly "earnRatio": number;
  readonly "result"?: string;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type BetDefinitionCatalog = CatalogTable<BetDefinition>;
