import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { ExchangeDefinition } from "../types/exchange.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./exchange.records0.ts";
export const catalog: CatalogTable<ExchangeDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "exchange", "start": 0, "count": 351 }],
};
