import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { GeneralSaleDefinition } from "../types/general_sale.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./general_sale.records0.ts";
export const catalog: CatalogTable<GeneralSaleDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
