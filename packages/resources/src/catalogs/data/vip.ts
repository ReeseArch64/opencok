import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { VipDefinition } from "../types/vip.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./vip.records0.ts";

export const catalog: CatalogTable<VipDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "vip", "start": 0, "count": 10 }],
};
