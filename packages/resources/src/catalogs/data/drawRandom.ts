import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { DrawRandomDefinition } from "../types/drawRandom.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./drawRandom.records0.ts";
export const catalog: CatalogTable<DrawRandomDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "drawRandom", "start": 0, "count": 4 }],
};
