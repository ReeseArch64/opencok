import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { GeneralMaxNumDefinition } from "@opencok/hero/resources/catalogs/types/general_max_num";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./general_max_num.records0.ts";

export const catalog: CatalogTable<GeneralMaxNumDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [{ "id": "general_max_num", "start": 0, "count": 654 }],
};
