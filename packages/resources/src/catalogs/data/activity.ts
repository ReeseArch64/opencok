import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { ActivityDefinition } from "../types/activity.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./activity.records0.ts";
export const catalog: CatalogTable<ActivityDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
