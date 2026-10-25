export interface SignIn2Definition {
  readonly "id": number;
  readonly "day": number;
  readonly "reward": number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type SignIn2DefinitionCatalog = CatalogTable<SignIn2Definition>;
