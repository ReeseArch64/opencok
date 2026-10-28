import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { ActionDefinition } from "../types/action.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./action.records0.ts";

export const catalog: CatalogTable<ActionDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
