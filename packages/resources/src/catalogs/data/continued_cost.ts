import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { ContinuedCostDefinition } from "../types/continued_cost.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./continued_cost.records0.ts";

export const catalog: CatalogTable<ContinuedCostDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
