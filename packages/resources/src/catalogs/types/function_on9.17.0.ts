export interface FunctionOn9170Definition {
  readonly "id": number | string;
  readonly "online": number | readonly number[] | string;
  readonly "test": number | string;
  readonly "version": string;
  readonly "pf": number | string;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type FunctionOn9170DefinitionCatalog = CatalogTable<FunctionOn9170Definition>;
