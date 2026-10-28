import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { WebCheckDefinition } from "../types/webCheck.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./webCheck.records0.ts";

export const catalog: CatalogTable<WebCheckDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [
        { "id": "payClass", "start": 0, "count": 7 },
        { "id": "normalWhiteList", "start": 7, "count": 1 },
        { "id": "payWhiteList", "start": 8, "count": 1 },
    ],
};
