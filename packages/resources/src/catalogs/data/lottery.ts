import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { LotteryDefinition } from "../types/lottery.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./lottery.records0.ts";
export const catalog: CatalogTable<LotteryDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
