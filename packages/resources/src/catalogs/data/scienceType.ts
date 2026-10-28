import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { ScienceTypeDefinition } from "../types/scienceType.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./scienceType.records0.ts";

export const catalog: CatalogTable<ScienceTypeDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [{ "id": "scienceType", "start": 0, "count": 17 }],
};
