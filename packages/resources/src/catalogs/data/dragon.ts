import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { DragonDefinition } from "../types/dragon.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./dragon.records0.ts";

export const catalog: CatalogTable<DragonDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
