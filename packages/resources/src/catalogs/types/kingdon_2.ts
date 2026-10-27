export interface Kingdon2Definition {
  readonly "id": number;
  readonly "name": string;
  readonly "ip": string;
  readonly "port": number;
  readonly "zone": string;
  readonly "recommend": string;
  readonly "hot": string;
  readonly "new": string;
  readonly "test": string;
  readonly "openTime": string;
  readonly "innerIp": string;
  readonly "dbIp": string;
  readonly "dbName": string;
  readonly "serverType": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type Kingdon2DefinitionCatalog = CatalogTable<Kingdon2Definition>;
