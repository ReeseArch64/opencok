import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { LuckyDayDefinition } from "../types/lucky_day.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./lucky_day.records0.ts";
export const catalog: CatalogTable<LuckyDayDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
