import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { BarbarionDefinition } from "../types/barbarion.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./barbarion.records0.ts";
export const catalog: CatalogTable<BarbarionDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "barbarion", "start": 0, "count": 13 }],
};
