import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { TowerDefinition } from "../types/tower.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./tower.records0.ts";

export const catalog: CatalogTable<TowerDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
