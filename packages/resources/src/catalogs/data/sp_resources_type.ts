import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { SpResourcesTypeDefinition } from "../types/sp_resources_type.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./sp_resources_type.records0.ts";
export const catalog: CatalogTable<SpResourcesTypeDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "sp_resources_type", "start": 0, "count": 12 }],
};
