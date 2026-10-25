import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { SpResourcesListDefinition } from "../types/sp_resources_list.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./sp_resources_list.records0.ts";
export const catalog: CatalogTable<SpResourcesListDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
