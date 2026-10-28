import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { TerritoryDefinition } from "../types/territory.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./territory.records0.ts";

export const catalog: CatalogTable<TerritoryDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
