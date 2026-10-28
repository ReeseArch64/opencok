export interface WapMatchDefinition
{
    readonly "id": string;
    readonly "k1": string;
    readonly "k2": string;
    readonly "k3": string;
    readonly "k4": string;
    readonly "k5": string;
    readonly "k6": string;
    readonly "k7": string;
    readonly "k8": string;
    readonly "k9": string;
    readonly "k10": readonly number[];
}

import type { CatalogTable } from "../../catalog-model.ts";

export type WapMatchDefinitionCatalog = CatalogTable<WapMatchDefinition>;
