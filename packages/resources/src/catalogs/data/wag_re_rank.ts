import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { WagReRankDefinition } from "../types/wag_re_rank.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./wag_re_rank.records0.ts";

export const catalog: CatalogTable<WagReRankDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
