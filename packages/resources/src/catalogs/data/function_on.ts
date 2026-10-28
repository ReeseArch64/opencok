import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { FunctionOnDefinition } from "../types/function_on.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./function_on.records0.ts";
import { records as records1 } from "./function_on.records1.ts";
import { records as records2 } from "./function_on.records2.ts";

export const catalog: CatalogTable<FunctionOnDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0, ...records1, ...records2],
    "sections": [{ "id": "function_on", "start": 0, "count": 2028 }],
};
