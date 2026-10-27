export interface HeroactivityDefinition {
  readonly "id": number;
  readonly "type": number;
  readonly "datetype": number;
  readonly "date": readonly (readonly number[])[];
  readonly "cycle": readonly number[];
  readonly "spcial": number;
  readonly "random": number;
  readonly "activity": readonly (readonly number[])[];
}

import type { CatalogTable } from "@opencok/resources/catalog-model";

export type HeroactivityDefinitionCatalog = CatalogTable<HeroactivityDefinition>;
