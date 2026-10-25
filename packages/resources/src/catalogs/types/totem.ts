export interface TotemDefinition {
  readonly "id": number;
  readonly "totemType": number;
  readonly "architecture": number;
  readonly "friendlyStateId": number;
  readonly "coverArea": number;
  readonly "rangeOfAction": number;
  readonly "takeEffectTime": number;
  readonly "minimumTime": number;
  readonly "reduceTime": number;
  readonly "cdTime": number;
  readonly "placeMail": number;
  readonly "disappearingMail": number;
  readonly "recycleMail": number;
  readonly "removeMail": number;
  readonly "attackMail": number;
  readonly "takeEffectMail": number;
  readonly "vitalCoefficient": number;
}

import type { CatalogTable } from "../../catalog-model.ts";
export type TotemDefinitionCatalog = CatalogTable<TotemDefinition>;
