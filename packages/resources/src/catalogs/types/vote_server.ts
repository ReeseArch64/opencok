export interface VoteServerDefinition {
  readonly "id": number;
  readonly "item": readonly number[];
  readonly "quantity": readonly number[];
  readonly "gold": bigint;
  readonly "times": number;
  readonly "UIID": number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type VoteServerDefinitionCatalog = CatalogTable<VoteServerDefinition>;
