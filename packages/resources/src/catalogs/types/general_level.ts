export interface GeneralLevelDefinition {
  readonly "id": number;
  readonly "level": number;
  readonly "experience": number;
  readonly "point": number;
  readonly "exp1": number;
  readonly "point1": number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type GeneralLevelDefinitionCatalog = CatalogTable<GeneralLevelDefinition>;
