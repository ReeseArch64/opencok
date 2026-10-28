export interface RecallActivityDefinition
{
    readonly "id": number;
    readonly "k1": string;
    readonly "k2": number;
    readonly "k3": string;
    readonly "k4": string;
    readonly "k5": number;
    readonly "k6": readonly (readonly number[])[];
    readonly "k7": string;
    readonly "k8": readonly (readonly number[])[];
    readonly "k10": string;
    readonly "k11": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type RecallActivityDefinitionCatalog = CatalogTable<RecallActivityDefinition>;
