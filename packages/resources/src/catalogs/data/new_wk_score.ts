import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { NewWkScoreDefinition } from "../types/new_wk_score.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./new_wk_score.records0.ts";

export const catalog: CatalogTable<NewWkScoreDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
