export interface ServersDefinition
{
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
}

import type { CatalogTable } from "../../catalog-model.ts";

export type ServersDefinitionCatalog = CatalogTable<ServersDefinition>;
