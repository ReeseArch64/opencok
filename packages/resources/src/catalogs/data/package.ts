import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { PackageDefinition } from "../types/package.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./package.records0.ts";

export const catalog: CatalogTable<PackageDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
