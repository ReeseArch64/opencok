import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { FunctionStarDefinition } from "../types/function_star.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./function_star.records0.ts";
export const catalog: CatalogTable<FunctionStarDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "function_star", "start": 0, "count": 156 }],
};
