import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { Drconfig9260Definition } from "../types/drconfig9.26.0.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./drconfig9.26.0.records0.ts";

export const catalog: CatalogTable<Drconfig9260Definition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
