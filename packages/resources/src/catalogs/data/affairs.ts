import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { AffairsDefinition } from "../types/affairs.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./affairs.records0.ts";

export const catalog: CatalogTable<AffairsDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [
        { "id": "k1", "start": 0, "count": 21 },
        { "id": "k2", "start": 21, "count": 11 },
        { "id": "k3", "start": 32, "count": 10 },
        { "id": "k4", "start": 42, "count": 10 },
        { "id": "k5", "start": 52, "count": 10 },
        { "id": "k6", "start": 62, "count": 10 },
    ],
};
