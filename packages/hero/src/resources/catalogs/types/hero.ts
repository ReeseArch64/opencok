export interface HeroDefinition {
  readonly "id": number;
  readonly "level": number;
  readonly "experience": number;
  readonly "para1": readonly (readonly number[])[];
  readonly "out": number;
  readonly "special": number;
  readonly "group": number;
  readonly "resourceType": readonly number[];
  readonly "resourceOnce": number | readonly number[];
  readonly "expOnce": number | readonly number[];
  readonly "power": number;
  readonly "para2"?: readonly (readonly number[])[];
  readonly "para3"?: readonly number[];
  readonly "para4"?: readonly number[];
  readonly "relateHero"?: number;
  readonly "item"?: readonly number[];
}

import type { CatalogTable } from "@opencok/resources/catalog-model";

export type HeroDefinitionCatalog = CatalogTable<HeroDefinition>;
