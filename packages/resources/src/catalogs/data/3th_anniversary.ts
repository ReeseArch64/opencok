import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { Catalog3thAnniversaryDefinition } from "../types/3th_anniversary.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./3th_anniversary.records0.ts";

export const catalog: CatalogTable<Catalog3thAnniversaryDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
