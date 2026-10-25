export interface Catalog3thAnniversaryControlDefinition {
  readonly "id": number;
  readonly "start": string;
  readonly "end": string;
  readonly "name": number;
  readonly "scoreReward": readonly (readonly number[])[];
}

import type { CatalogTable } from "../../catalog-model.ts";
export type Catalog3thAnniversaryControlDefinitionCatalog =
  CatalogTable<Catalog3thAnniversaryControlDefinition>;
