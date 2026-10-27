export interface CivilizationInjuryDefinition {
  readonly "id": number;
  readonly "DValueS": number;
  readonly "DValueE": number;
  readonly "DValue1per": number;
  readonly "Cumulants": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type CivilizationInjuryDefinitionCatalog = CatalogTable<CivilizationInjuryDefinition>;
