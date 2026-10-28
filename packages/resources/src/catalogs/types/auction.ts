export interface AuctionDefinition
{
    readonly "id": number;
    readonly "colour": number;
    readonly "item": number;
    readonly "number": number;
    readonly "rate": number;
    readonly "price": bigint;
    readonly "add": number;
    readonly "decision": number;
}

import type { CatalogTable } from "../../catalog-model.ts";

export type AuctionDefinitionCatalog = CatalogTable<AuctionDefinition>;
