import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { WishDefinition } from "../types/wish.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./wish.records0.ts";

export const catalog: CatalogTable<WishDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
