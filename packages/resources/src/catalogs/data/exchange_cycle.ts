import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { ExchangeCycleDefinition } from "../types/exchange_cycle.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./exchange_cycle.records0.ts";

export const catalog: CatalogTable<ExchangeCycleDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
