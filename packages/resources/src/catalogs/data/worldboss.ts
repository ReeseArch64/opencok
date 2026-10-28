import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { WorldbossDefinition } from "../types/worldboss.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./worldboss.records0.ts";

export const catalog: CatalogTable<WorldbossDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
