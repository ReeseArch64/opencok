import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { WapReRankDefinition } from "../types/wap_re_rank.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./wap_re_rank.records0.ts";

export const catalog: CatalogTable<WapReRankDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
