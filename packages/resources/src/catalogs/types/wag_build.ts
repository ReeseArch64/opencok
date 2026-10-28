export interface WagBuildDefinition
{
    readonly "id": number;
    readonly "type": number;
    readonly "time": number;
    readonly "parm1": number | readonly number[];
    readonly "location": readonly number[];
    readonly "itemId": number;
    readonly "parm2"?: number | readonly number[];
    readonly "parm3"?: string;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type WagBuildDefinitionCatalog = CatalogTable<WagBuildDefinition>;
