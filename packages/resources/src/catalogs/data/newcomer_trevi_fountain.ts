import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { NewcomerTreviFountainDefinition } from "../types/newcomer_trevi_fountain.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./newcomer_trevi_fountain.records0.ts";

export const catalog: CatalogTable<NewcomerTreviFountainDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
