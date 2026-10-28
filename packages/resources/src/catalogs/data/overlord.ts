import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { OverlordDefinition } from "../types/overlord.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./overlord.records0.ts";

export const catalog: CatalogTable<OverlordDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
