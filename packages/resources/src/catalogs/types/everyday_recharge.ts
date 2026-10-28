export interface EverydayRechargeDefinition
{
    readonly "id": number;
    readonly "type": number;
    readonly "reward": number;
    readonly "quantity": number;
    readonly "goldCount"?: number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type EverydayRechargeDefinitionCatalog = CatalogTable<EverydayRechargeDefinition>;
