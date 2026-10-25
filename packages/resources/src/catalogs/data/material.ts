import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { MaterialDefinition } from "../types/material.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./material.records0.ts";
export const catalog: CatalogTable<MaterialDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "meterial", "start": 0, "count": 17 }],
};
