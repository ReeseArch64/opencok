export interface DragonCommunicateDefinition {
  readonly "id": number;
  readonly "name": number;
  readonly "addFriendship": number;
  readonly "cdTime": number;
  readonly "friendshipLimit": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type DragonCommunicateDefinitionCatalog = CatalogTable<DragonCommunicateDefinition>;
