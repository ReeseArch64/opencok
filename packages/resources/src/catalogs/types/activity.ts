export interface ActivityDefinition {
  readonly "id": number;
  readonly "type": number;
  readonly "events": readonly number[];
  readonly "duration": number;
  readonly "delay": number;
  readonly "service"?: readonly number[];
  readonly "wait"?: number;
  readonly "finalReward"?: readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type ActivityDefinitionCatalog = CatalogTable<ActivityDefinition>;
