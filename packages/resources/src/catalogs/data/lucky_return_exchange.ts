import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { LuckyReturnExchangeDefinition } from "../types/lucky_return_exchange.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./lucky_return_exchange.records0.ts";

export const catalog: CatalogTable<LuckyReturnExchangeDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [{ "id": "lucky_return_exchange", "start": 0, "count": 44 }],
};
