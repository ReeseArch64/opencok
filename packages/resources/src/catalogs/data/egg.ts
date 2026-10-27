import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { EggDefinition } from "../types/egg.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./egg.records0.ts";

export const catalog: CatalogTable<EggDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "egg", "start": 0, "count": 6 }],
};
