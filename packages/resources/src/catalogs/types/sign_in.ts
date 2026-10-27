export interface SignInDefinition {
  readonly "id": number;
  readonly "Day": number;
  readonly "Week1": readonly number[];
  readonly "Week2": readonly number[];
  readonly "Week3": readonly number[];
  readonly "Week4": readonly number[];
  readonly "Week5": readonly number[];
  readonly "Week6": readonly number[];
  readonly "Week7": readonly number[];
  readonly "Week8": readonly number[];
  readonly "Week1Svip": readonly number[];
  readonly "Week2Svip": readonly number[];
  readonly "Week3Svip": readonly number[];
  readonly "Week4Svip": readonly number[];
  readonly "Week5Svip": readonly number[];
  readonly "Week6Svip": readonly number[];
  readonly "Week7Svip": readonly number[];
  readonly "Week8Svip": readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type SignInDefinitionCatalog = CatalogTable<SignInDefinition>;
