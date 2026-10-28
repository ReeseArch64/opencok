import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { GoldPriceDefinition } from "../types/gold_price.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./gold_price.records0.ts";

export const catalog: CatalogTable<GoldPriceDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
