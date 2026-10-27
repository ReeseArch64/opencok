import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { ActivityPageDefinition } from "../types/activity_page.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./activity_page.records0.ts";

export const catalog: CatalogTable<ActivityPageDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "activity_page", "start": 0, "count": 14 }],
};
