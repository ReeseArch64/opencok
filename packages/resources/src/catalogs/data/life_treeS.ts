import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { LifeTreeSDefinition } from "../types/life_treeS.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./life_treeS.records0.ts";

export const catalog: CatalogTable<LifeTreeSDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [{ "id": "life_treeS", "start": 0, "count": 2 }],
};
