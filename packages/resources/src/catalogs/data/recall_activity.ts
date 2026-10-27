import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { RecallActivityDefinition } from "../types/recall_activity.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./recall_activity.records0.ts";

export const catalog: CatalogTable<RecallActivityDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
