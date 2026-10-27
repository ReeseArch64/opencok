export interface ScienceRaceTypeDefinition {
  readonly "id": number;
  readonly "tab": number;
  readonly "name": number | readonly number[];
  readonly "description": number;
  readonly "icon": string;
  readonly "position": readonly number[];
  readonly "relation"?: readonly (readonly number[])[];
  readonly "show": number;
  readonly "lvpower": number | readonly number[];
  readonly "lvpropadd": number | readonly number[];
  readonly "midLv"?: number;
  readonly "para2add"?: readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type ScienceRaceTypeDefinitionCatalog = CatalogTable<ScienceRaceTypeDefinition>;
