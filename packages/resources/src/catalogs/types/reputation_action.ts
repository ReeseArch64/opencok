export interface ReputationActionDefinition {
  readonly "id": number;
  readonly "type": number;
  readonly "quantity"?: number;
  readonly "civilization": number;
  readonly "currentReputation": number;
  readonly "otherReputation": number;
  readonly "reputationPoint": number;
  readonly "level"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type ReputationActionDefinitionCatalog = CatalogTable<ReputationActionDefinition>;
