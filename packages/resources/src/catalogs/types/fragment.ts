export interface FragmentDefinition
{
    readonly "id": number;
    readonly "form": number;
    readonly "sameItem": number;
    readonly "type": number;
    readonly "exchangeId": readonly number[];
    readonly "reward": readonly number[];
    readonly "rewardRate": readonly number[];
    readonly "rate": number;
    readonly "quantity": number;
    readonly "muti": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type FragmentDefinitionCatalog = CatalogTable<FragmentDefinition>;
