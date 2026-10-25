import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { QuickBuildingDefinition } from "../types/quick_building.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./quick_building.records0.ts";
export const catalog: CatalogTable<QuickBuildingDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
