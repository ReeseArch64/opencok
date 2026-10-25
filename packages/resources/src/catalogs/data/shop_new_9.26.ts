import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { ShopNew926Definition } from "../types/shop_new_9.26.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./shop_new_9.26.records0.ts";
import { records as records1 } from "./shop_new_9.26.records1.ts";
import { records as records2 } from "./shop_new_9.26.records2.ts";
export const catalog: CatalogTable<ShopNew926Definition> = {
  "kind": CatalogKind.Table,
  "records": [...records0, ...records1, ...records2],
  "sections": [],
};
