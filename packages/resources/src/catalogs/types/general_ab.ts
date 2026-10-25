export interface GeneralAbDefinition {
  readonly "id": number;
  readonly "name": number;
  readonly "description": number;
  readonly "position": readonly (readonly number[])[];
  readonly "icon": string;
  readonly "skill": readonly number[];
  readonly "relation": readonly (readonly number[])[];
}

import type { CatalogTable } from "../../catalog-model.ts";
export type GeneralAbDefinitionCatalog = CatalogTable<GeneralAbDefinition>;
