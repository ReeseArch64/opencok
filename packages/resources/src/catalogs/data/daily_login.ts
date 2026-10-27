import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { DailyLoginDefinition } from "../types/daily_login.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./daily_login.records0.ts";

export const catalog: CatalogTable<DailyLoginDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
