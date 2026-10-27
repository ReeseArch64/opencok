import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { GeneralAwakeDefinition } from "../types/general_awake.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./general_awake.records0.ts";

export const catalog: CatalogTable<GeneralAwakeDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "general_awake", "start": 0, "count": 29 }],
};
