export interface GeneralOfficialDefinition {
  readonly "id": number;
  readonly "official": number;
  readonly "effect": number | readonly number[];
  readonly "unlock": readonly number[];
  readonly "unlockPersonNum": number | readonly number[];
  readonly "posNum": number;
  readonly "posExp": readonly (readonly number[])[];
  readonly "posUnlock": readonly (readonly number[])[];
}

import type { CatalogTable } from "../../catalog-model.ts";
export type GeneralOfficialDefinitionCatalog = CatalogTable<GeneralOfficialDefinition>;
