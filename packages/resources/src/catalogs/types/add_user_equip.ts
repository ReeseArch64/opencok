export interface AddUserEquipDefinition {
  readonly "id": number;
  readonly "strengthLevel": number;
  readonly "count": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type AddUserEquipDefinitionCatalog = CatalogTable<AddUserEquipDefinition>;
