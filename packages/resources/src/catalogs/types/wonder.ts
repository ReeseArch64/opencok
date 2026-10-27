export interface WonderDefinition {
  readonly "id": number;
  readonly "type": number;
  readonly "armyLimit": number;
  readonly "positionX": number;
  readonly "positionY": number;
  readonly "long": number;
  readonly "timePeace": number;
  readonly "timeFire": number;
  readonly "idArea": number;
  readonly "reward": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type WonderDefinitionCatalog = CatalogTable<WonderDefinition>;
