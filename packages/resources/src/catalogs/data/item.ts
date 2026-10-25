import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { ItemDefinition } from "../types/item.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./item.records0.ts";
export const catalog: CatalogTable<ItemDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "data_config", "start": 0, "count": 459 }],
};
