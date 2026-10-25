import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { DailyRechargeDefinition } from "../types/daily_recharge.ts";
import type { CatalogTable } from "../../catalog-model.ts";
export const catalog: CatalogTable<DailyRechargeDefinition> = {
  "kind": CatalogKind.Table,
  "records": [],
  "sections": [],
};
