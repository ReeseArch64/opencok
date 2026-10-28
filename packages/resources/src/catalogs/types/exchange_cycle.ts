export interface ExchangeCycleDefinition
{
    readonly "id": number;
    readonly "exchangeid": number;
    readonly "level": readonly number[];
    readonly "stage": number;
    readonly "time": number;
    readonly "page": number;
    readonly "hot": number;
    readonly "name": number;
    readonly "probality": number;
    readonly "reward": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type ExchangeCycleDefinitionCatalog = CatalogTable<ExchangeCycleDefinition>;
