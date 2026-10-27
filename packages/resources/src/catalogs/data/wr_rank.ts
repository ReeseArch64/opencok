import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { WrRankDefinition } from "../types/wr_rank.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./wr_rank.records0.ts";

export const catalog: CatalogTable<WrRankDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
