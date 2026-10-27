export interface GeneralStationDefinition {
  readonly "id": number;
  readonly "build": number;
  readonly "effect": readonly (readonly number[])[] | string;
  readonly "station": number;
  readonly "functionOnline": string;
  readonly "functionTest": string;
  readonly "version": string;
  readonly "speEffect"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type GeneralStationDefinitionCatalog = CatalogTable<GeneralStationDefinition>;
