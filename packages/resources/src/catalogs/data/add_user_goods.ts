import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { AddUserGoodsDefinition } from "../types/add_user_goods.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./add_user_goods.records0.ts";

export const catalog: CatalogTable<AddUserGoodsDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [{ "id": "add_user_goods", "start": 0, "count": 10 }],
};
