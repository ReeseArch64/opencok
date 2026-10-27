import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { MonarchDefinition } from "../types/monarch.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./monarch.records0.ts";

export const catalog: CatalogTable<MonarchDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
