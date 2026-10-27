import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { WkScoreDefinition } from "../types/wk_score.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./wk_score.records0.ts";

export const catalog: CatalogTable<WkScoreDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
