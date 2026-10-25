import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { TradeDefinition } from "../types/trade.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./trade.records0.ts";
import { records as records1 } from "./trade.records1.ts";
import { records as records2 } from "./trade.records2.ts";
export const catalog: CatalogTable<TradeDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0, ...records1, ...records2],
  "sections": [],
};
