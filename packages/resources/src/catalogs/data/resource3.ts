import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { Resource3Definition } from "../types/resource3.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./resource3.records0.ts";

export const catalog: CatalogTable<Resource3Definition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "resource3", "start": 0, "count": 42 }],
};
