import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { ComebackDefinition } from "../types/comeback.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./comeback.records0.ts";
export const catalog: CatalogTable<ComebackDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "comeback", "start": 0, "count": 1 }],
};
