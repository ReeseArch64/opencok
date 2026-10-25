import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { RankDefinition } from "../types/rank.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./rank.records0.ts";
export const catalog: CatalogTable<RankDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "rank", "start": 0, "count": 5 }],
};
