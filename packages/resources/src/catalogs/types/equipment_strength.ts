export interface EquipmentStrengthDefinition {
  readonly "id": number;
  readonly "suitEffect": string;
  readonly "suitValue": string;
  readonly "suitDialog": string;
  readonly "suitValueType": string;
  readonly "suitValueSign": string;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type EquipmentStrengthDefinitionCatalog = CatalogTable<EquipmentStrengthDefinition>;
