import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { BoxOrdinaryDefinition } from "../types/box_ordinary.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./box_ordinary.records0.ts";

export const catalog: CatalogTable<BoxOrdinaryDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
