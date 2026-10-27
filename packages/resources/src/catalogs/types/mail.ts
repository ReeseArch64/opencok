export interface MailDefinition {
  readonly "id": number;
  readonly "sender"?: number;
  readonly "title"?: number;
  readonly "message"?: number;
  readonly "reward"?: number;
  readonly "type"?: number;
  readonly "donate"?: number;
  readonly "share"?: number;
  readonly "build"?: number;
  readonly "alWar"?: number;
  readonly "shop"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type MailDefinitionCatalog = CatalogTable<MailDefinition>;
