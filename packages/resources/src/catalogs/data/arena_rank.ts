import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { ArenaRankDefinition } from "../types/arena_rank.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./arena_rank.records0.ts";
export const catalog: CatalogTable<ArenaRankDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
