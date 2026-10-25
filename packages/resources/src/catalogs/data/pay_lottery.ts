import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { PayLotteryDefinition } from "../types/pay_lottery.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./pay_lottery.records0.ts";
export const catalog: CatalogTable<PayLotteryDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
