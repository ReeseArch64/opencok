import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { SvipShopBuildingDefinition } from "../types/svip_shop_building.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./svip_shop_building.records0.ts";

export const catalog: CatalogTable<SvipShopBuildingDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
