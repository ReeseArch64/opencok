import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { BocaiDragonDefinition } from "../types/bocai_dragon.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./bocai_dragon.records0.ts";
export const catalog: CatalogTable<BocaiDragonDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "bocai_dragon", "start": 0, "count": 1 }],
};
