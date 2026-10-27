export interface DailyLoginDefinition {
  readonly "id": number;
  readonly "Day": number;
  readonly "Week1": readonly number[];
  readonly "Feed1": number;
  readonly "Send1": number;
  readonly "Invite1": number;
  readonly "Week2": readonly number[];
  readonly "Feed2": number;
  readonly "Send2": number;
  readonly "Invite2": number;
  readonly "Week3": readonly number[];
  readonly "Feed3": number;
  readonly "Send3": number;
  readonly "Invite3": number;
  readonly "Week4": readonly number[];
  readonly "Feed4": number;
  readonly "Send4": number;
  readonly "Invite4": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type DailyLoginDefinitionCatalog = CatalogTable<DailyLoginDefinition>;
