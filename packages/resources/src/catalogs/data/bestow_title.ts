import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { BestowTitleDefinition } from "../types/bestow_title.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./bestow_title.records0.ts";

export const catalog: CatalogTable<BestowTitleDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "bestow_title", "start": 0, "count": 6 }],
};
