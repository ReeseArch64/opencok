export interface MergeActivityDefinition
{
    readonly "id": number;
    readonly "activityId": number;
    readonly "mergeStart": number;
    readonly "mergeEnd": number;
    readonly "para1"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type MergeActivityDefinitionCatalog = CatalogTable<MergeActivityDefinition>;
