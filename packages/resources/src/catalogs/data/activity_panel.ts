import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { ActivityPanelDefinition } from "../types/activity_panel.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./activity_panel.records0.ts";
export const catalog: CatalogTable<ActivityPanelDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
