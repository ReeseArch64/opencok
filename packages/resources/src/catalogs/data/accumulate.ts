import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { AccumulateDefinition } from "../types/accumulate.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./accumulate.records0.ts";

export const catalog: CatalogTable<AccumulateDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
