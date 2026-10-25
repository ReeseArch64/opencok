import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { GeneralDrawDefinition } from "../types/general_draw.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./general_draw.records0.ts";
export const catalog: CatalogTable<GeneralDrawDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "general_draw", "start": 0, "count": 286 }],
};
