import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { HotgoodsDefinition } from "../types/hotgoods.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./hotgoods.records0.ts";

export const catalog: CatalogTable<HotgoodsDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
