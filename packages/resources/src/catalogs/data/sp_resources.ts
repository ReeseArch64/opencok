import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { SpResourcesDefinition } from "../types/sp_resources.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./sp_resources.records0.ts";
export const catalog: CatalogTable<SpResourcesDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "sp_resources", "start": 0, "count": 161 }],
};
