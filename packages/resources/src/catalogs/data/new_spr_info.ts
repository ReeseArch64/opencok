import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { NewSprInfoDefinition } from "../types/new_spr_info.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./new_spr_info.records0.ts";
export const catalog: CatalogTable<NewSprInfoDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
