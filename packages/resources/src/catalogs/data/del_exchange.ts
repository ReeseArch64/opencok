import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { DelExchangeDefinition } from "../types/del_exchange.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./del_exchange.records0.ts";
import { records as records1 } from "./del_exchange.records1.ts";
import { records as records2 } from "./del_exchange.records2.ts";
import { records as records3 } from "./del_exchange.records3.ts";
import { records as records4 } from "./del_exchange.records4.ts";
import { records as records5 } from "./del_exchange.records5.ts";
import { records as records6 } from "./del_exchange.records6.ts";
import { records as records7 } from "./del_exchange.records7.ts";
import { records as records8 } from "./del_exchange.records8.ts";
import { records as records9 } from "./del_exchange.records9.ts";

export const catalog: CatalogTable<DelExchangeDefinition> = {
    "kind": CatalogKind.Table,
    "records": [
        ...records0,
        ...records1,
        ...records2,
        ...records3,
        ...records4,
        ...records5,
        ...records6,
        ...records7,
        ...records8,
        ...records9,
    ],
    "sections": [{ "id": "exchange", "start": 0, "count": 7114 }],
};
