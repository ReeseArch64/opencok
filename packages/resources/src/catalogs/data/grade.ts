import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { GradeDefinition } from "../types/grade.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./grade.records0.ts";
export const catalog: CatalogTable<GradeDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
