import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { HotstoreDefinition } from "../types/hotstore.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./hotstore.records0.ts";
export const catalog: CatalogTable<HotstoreDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
