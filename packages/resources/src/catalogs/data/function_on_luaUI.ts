import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { FunctionOnLuaUIDefinition } from "../types/function_on_luaUI.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./function_on_luaUI.records0.ts";
export const catalog: CatalogTable<FunctionOnLuaUIDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "function_on_luaUI", "start": 0, "count": 3 }],
};
