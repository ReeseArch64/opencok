export interface StatusCopyDefinition
{
    readonly "id": number | string;
    readonly "type2"?: number;
    readonly "time"?: number;
    readonly "effect"?: readonly (readonly number[])[] | string;
    readonly "overlap"?: number;
    readonly "group"?: number;
    readonly "subgroup"?: number | string;
    readonly "type"?: number;
    readonly "chatid"?: number;
    readonly "object"?: number;
    readonly "objectNum"?: number;
    readonly "battleOverlap"?: number;
    readonly "effectAdd"?: readonly (readonly number[])[];
    readonly "skill"?: number;
    readonly "random"?: number;
    readonly "type3"?: number;
    readonly "subscribe"?: number;
    readonly "reset"?: number;
    readonly "autoend"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type StatusCopyDefinitionCatalog = CatalogTable<StatusCopyDefinition>;
