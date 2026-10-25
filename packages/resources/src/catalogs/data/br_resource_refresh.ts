import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { BrResourceRefreshDefinition } from "../types/br_resource_refresh.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./br_resource_refresh.records0.ts";
export const catalog: CatalogTable<BrResourceRefreshDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "br_resource_refresh", "start": 0, "count": 4 }],
};
