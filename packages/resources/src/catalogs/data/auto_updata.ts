import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { AutoUpdataDefinition } from "../types/auto_updata.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./auto_updata.records0.ts";

export const catalog: CatalogTable<AutoUpdataDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [{ "id": "auto_updata", "start": 0, "count": 2 }],
};
