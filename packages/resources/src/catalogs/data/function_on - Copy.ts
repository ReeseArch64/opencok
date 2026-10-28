import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { FunctionOnCopyDefinition } from "../types/function_on - Copy.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./function_on - Copy.records0.ts";
import { records as records1 } from "./function_on - Copy.records1.ts";
import { records as records2 } from "./function_on - Copy.records2.ts";

export const catalog: CatalogTable<FunctionOnCopyDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0, ...records1, ...records2],
    "sections": [{ "id": "function_on", "start": 0, "count": 1976 }],
};
