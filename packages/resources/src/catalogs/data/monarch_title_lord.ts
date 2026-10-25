import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { MonarchTitleLordDefinition } from "../types/monarch_title_lord.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./monarch_title_lord.records0.ts";
export const catalog: CatalogTable<MonarchTitleLordDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
