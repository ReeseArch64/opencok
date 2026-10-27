export interface WagReTeamDefinition {
  readonly "id": number;
  readonly "round": number;
  readonly "reward": number;
  readonly "thumbup": readonly (readonly (readonly number[])[])[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type WagReTeamDefinitionCatalog = CatalogTable<WagReTeamDefinition>;
