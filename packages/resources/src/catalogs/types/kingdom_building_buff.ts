export interface KingdomBuildingBuffDefinition
{
    readonly "id": number;
    readonly "type": number;
    readonly "base"?: readonly number[];
    readonly "cdTimeOnce"?: number;
    readonly "donateOnce"?: readonly (readonly number[])[];
    readonly "cost"?: readonly (readonly number[])[];
    readonly "active"?: number;
    readonly "cdTimeLimit"?: number;
    readonly "right"?: readonly number[];
    readonly "premise"?: number;
    readonly "icon"?: string;
    readonly "title"?: number;
    readonly "description"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type KingdomBuildingBuffDefinitionCatalog = CatalogTable<KingdomBuildingBuffDefinition>;
