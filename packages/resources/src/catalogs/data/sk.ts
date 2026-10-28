import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { SkDefinition } from "../types/sk.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./sk.records0.ts";

export const catalog: CatalogTable<SkDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
