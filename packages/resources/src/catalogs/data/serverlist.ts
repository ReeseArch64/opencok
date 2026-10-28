import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { ServerlistDefinition } from "../types/serverlist.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./serverlist.records0.ts";

export const catalog: CatalogTable<ServerlistDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [
        { "id": 1, "start": 0, "count": 1 },
        { "id": 2, "start": 1, "count": 1 },
        { "id": 3, "start": 2, "count": 1 },
        { "id": 4, "start": 3, "count": 1 },
    ],
};
