import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { AbDefinition } from "../types/ab.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./ab.records0.ts";
export const catalog: CatalogTable<AbDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
