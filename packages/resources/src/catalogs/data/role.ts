import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { RoleDefinition } from "../types/role.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./role.records0.ts";
export const catalog: CatalogTable<RoleDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
