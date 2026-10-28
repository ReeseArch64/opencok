import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { WagRoleDefinition } from "../types/wag_role.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./wag_role.records0.ts";

export const catalog: CatalogTable<WagRoleDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
