import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { Drconfig7260Definition } from "../types/drconfig7.26.0.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./drconfig7.26.0.records0.ts";
export const catalog: CatalogTable<Drconfig7260Definition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
