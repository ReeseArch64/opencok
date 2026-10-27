import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { MergeActivityDefinition } from "../types/merge_activity.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./merge_activity.records0.ts";

export const catalog: CatalogTable<MergeActivityDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
