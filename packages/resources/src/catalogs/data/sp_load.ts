import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { SpLoadDefinition } from "../types/sp_load.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./sp_load.records0.ts";
export const catalog: CatalogTable<SpLoadDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "sp_load", "start": 0, "count": 40 }],
};
