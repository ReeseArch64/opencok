import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { ArmsDefinition } from "../types/arms.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./arms.records0.ts";

export const catalog: CatalogTable<ArmsDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [{ "id": "arms", "start": 0, "count": 126 }],
};
