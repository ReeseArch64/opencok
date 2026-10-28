import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { GeneralCalledTaskDefinition } from "@opencok/hero/resources/catalogs/types/general_called_task";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./general_called_task.records0.ts";

export const catalog: CatalogTable<GeneralCalledTaskDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [{ "id": "general_called_task", "start": 0, "count": 16 }],
};
