import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { QuickScienceDefinition } from "../types/quick_science.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./quick_science.records0.ts";

export const catalog: CatalogTable<QuickScienceDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
