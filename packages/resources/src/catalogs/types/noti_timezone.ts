export interface NotiTimezoneDefinition
{
    readonly "country": string;
    readonly "time": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type NotiTimezoneDefinitionCatalog = CatalogTable<NotiTimezoneDefinition>;
