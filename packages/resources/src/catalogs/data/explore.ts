import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { ExploreDefinition } from "../types/explore.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./explore.records0.ts";

export const catalog: CatalogTable<ExploreDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
