import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { GiftDefinition } from "../types/gift.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./gift.records0.ts";

export const catalog: CatalogTable<GiftDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
