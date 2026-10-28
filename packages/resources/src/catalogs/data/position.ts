import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { PositionDefinition } from "../types/position.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./position.records0.ts";

export const catalog: CatalogTable<PositionDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
