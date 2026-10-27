import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { DgRefinementDefinition } from "../types/dg_refinement.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./dg_refinement.records0.ts";

export const catalog: CatalogTable<DgRefinementDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
