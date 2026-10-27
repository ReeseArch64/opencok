import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { TotemDefinition } from "../types/totem.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./totem.records0.ts";

export const catalog: CatalogTable<TotemDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "totem", "start": 0, "count": 13 }],
};
