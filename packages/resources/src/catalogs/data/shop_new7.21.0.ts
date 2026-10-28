import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { ShopNew7210Definition } from "../types/shop_new7.21.0.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./shop_new7.21.0.records0.ts";
import { records as records1 } from "./shop_new7.21.0.records1.ts";

export const catalog: CatalogTable<ShopNew7210Definition> = {
    "kind": CatalogKind.Table,
    "records": [...records0, ...records1],
    "sections": [],
};
