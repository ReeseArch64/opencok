import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { WagBuildDefinition } from "../types/wag_build.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./wag_build.records0.ts";

export const catalog: CatalogTable<WagBuildDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
