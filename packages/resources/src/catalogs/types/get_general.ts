export interface GetGeneralDefinition {
  readonly "id": number;
  readonly "heroId": number;
  readonly "type": readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type GetGeneralDefinitionCatalog = CatalogTable<GetGeneralDefinition>;
