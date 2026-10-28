import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { CompensationDefinition } from "../types/compensation.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./compensation.records0.ts";

export const catalog: CatalogTable<CompensationDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
