import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { Drconfig9140Definition } from "../types/drconfig9.14.0.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./drconfig9.14.0.records0.ts";

export const catalog: CatalogTable<Drconfig9140Definition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
