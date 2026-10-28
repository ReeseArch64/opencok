import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { FunctionOn9170Definition } from "../types/function_on9.17.0.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./function_on9.17.0.records0.ts";
import { records as records1 } from "./function_on9.17.0.records1.ts";
import { records as records2 } from "./function_on9.17.0.records2.ts";

export const catalog: CatalogTable<FunctionOn9170Definition> = {
    "kind": CatalogKind.Table,
    "records": [...records0, ...records1, ...records2],
    "sections": [{ "id": "function_on", "start": 0, "count": 1748 }],
};
