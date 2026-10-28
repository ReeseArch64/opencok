import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { FragmentDefinition } from "../types/fragment.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./fragment.records0.ts";

export const catalog: CatalogTable<FragmentDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
