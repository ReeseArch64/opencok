import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { LordDetailsDefinition } from "../types/lordDetails.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./lordDetails.records0.ts";

export const catalog: CatalogTable<LordDetailsDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
