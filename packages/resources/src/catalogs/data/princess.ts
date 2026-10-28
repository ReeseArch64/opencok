import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { PrincessDefinition } from "../types/princess.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./princess.records0.ts";

export const catalog: CatalogTable<PrincessDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
