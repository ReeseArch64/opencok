import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { ServerposDefinition } from "../types/serverpos.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./serverpos.records0.ts";
import { records as records1 } from "./serverpos.records1.ts";
import { records as records2 } from "./serverpos.records2.ts";
import { records as records3 } from "./serverpos.records3.ts";
import { records as records4 } from "./serverpos.records4.ts";
import { records as records5 } from "./serverpos.records5.ts";
import { records as records6 } from "./serverpos.records6.ts";
import { records as records7 } from "./serverpos.records7.ts";

export const catalog: CatalogTable<ServerposDefinition> = {
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
    ],
    "sections": [{ "id": "serverpos", "start": 0, "count": 5930 }],
};
