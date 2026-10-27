export interface FbShareDefinition {
  readonly "id": string;
  readonly "ON": number;
  readonly "Limit": number;
  readonly "method": string;
  readonly "objectType": string;
  readonly "object": string;
  readonly "ref": string;
  readonly "name"?: number;
  readonly "caption"?: number;
  readonly "linkDescription"?: number;
  readonly "link"?: string;
  readonly "pictureUrl"?: string;
  readonly "permissions"?: string;
  readonly "action"?: string;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type FbShareDefinitionCatalog = CatalogTable<FbShareDefinition>;
