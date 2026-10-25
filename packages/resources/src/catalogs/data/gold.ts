import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { GoldDefinition } from "../types/gold.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./gold.records0.ts";
export const catalog: CatalogTable<GoldDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
