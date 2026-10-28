import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { MarkDefinition } from "../types/mark.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./mark.records0.ts";

export const catalog: CatalogTable<MarkDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [{ "id": "Market", "start": 0, "count": 127 }],
};
