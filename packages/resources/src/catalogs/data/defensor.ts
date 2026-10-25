import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { DefensorDefinition } from "../types/defensor.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./defensor.records0.ts";
export const catalog: CatalogTable<DefensorDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "defensor", "start": 0, "count": 4 }],
};
