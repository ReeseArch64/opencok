import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { DrconfigDefinition } from "../types/drconfig.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./drconfig.records0.ts";
export const catalog: CatalogTable<DrconfigDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
