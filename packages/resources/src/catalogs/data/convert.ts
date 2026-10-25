import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { ConvertDefinition } from "../types/convert.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./convert.records0.ts";
export const catalog: CatalogTable<ConvertDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
