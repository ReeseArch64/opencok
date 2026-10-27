import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { MarketDefinition } from "../types/market.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./market.records0.ts";

export const catalog: CatalogTable<MarketDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "Market", "start": 0, "count": 4 }],
};
