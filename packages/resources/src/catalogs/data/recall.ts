import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { RecallDefinition } from "../types/recall.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./recall.records0.ts";
export const catalog: CatalogTable<RecallDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "recall", "start": 0, "count": 3 }],
};
