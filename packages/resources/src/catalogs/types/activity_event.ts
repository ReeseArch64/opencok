export interface ActivityEventDefinition
{
    readonly "id": number;
    readonly "k1"?: number | readonly number[] | string;
    readonly "k2"?: number | readonly number[] | string;
    readonly "k3"?: number | readonly (readonly number[])[] | string;
    readonly "k4"?: number | readonly (readonly number[])[] | string;
    readonly "k5"?: number | readonly number[];
    readonly "k6"?: readonly number[];
    readonly "k7"?: readonly number[];
    readonly "k8"?: number;
    readonly "k9"?: string;
    readonly "k10"?: string;
    readonly "k11"?: string;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type ActivityEventDefinitionCatalog = CatalogTable<ActivityEventDefinition>;
