export interface NewplayerDefinition
{
    readonly "id": number;
    readonly "day": number;
    readonly "k1": string;
    readonly "k2": string;
    readonly "k3": string;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type NewplayerDefinitionCatalog = CatalogTable<NewplayerDefinition>;
