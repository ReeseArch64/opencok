export interface DefensorDefinition
{
    readonly "id": number;
    readonly "k1": number;
    readonly "k2": number;
    readonly "k3": number;
    readonly "k4": number;
    readonly "k5": number;
    readonly "k6": number;
    readonly "k7": number;
    readonly "k8": number;
    readonly "k9": number;
    readonly "k10": number;
    readonly "k11": number;
    readonly "k12": number;
    readonly "k14": number;
    readonly "k15": readonly number[];
    readonly "k16": readonly (readonly number[])[];
    readonly "k18": number;
    readonly "k13"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type DefensorDefinitionCatalog = CatalogTable<DefensorDefinition>;
