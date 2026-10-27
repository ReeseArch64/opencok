import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { GrowthFundDefinition } from "../types/growth_fund.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./growth_fund.records0.ts";

export const catalog: CatalogTable<GrowthFundDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
