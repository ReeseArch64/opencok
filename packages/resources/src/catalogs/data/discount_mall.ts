import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { DiscountMallDefinition } from "../types/discount_mall.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./discount_mall.records0.ts";

export const catalog: CatalogTable<DiscountMallDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [{ "id": "discount_mall", "start": 0, "count": 77 }],
};
