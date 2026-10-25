import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { HeritageDefinition } from "../types/heritage.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./heritage.records0.ts";
export const catalog: CatalogTable<HeritageDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
