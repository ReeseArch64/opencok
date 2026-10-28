import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { NewExchangeDefinition } from "../types/new_exchange.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./new_exchange.records0.ts";
import { records as records1 } from "./new_exchange.records1.ts";
import { records as records2 } from "./new_exchange.records2.ts";

export const catalog: CatalogTable<NewExchangeDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0, ...records1, ...records2],
    "sections": [{ "id": "exchange", "start": 0, "count": 1796 }],
};
