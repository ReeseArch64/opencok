import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { BetDefinition } from "../types/bet.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./bet.records0.ts";

export const catalog: CatalogTable<BetDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
