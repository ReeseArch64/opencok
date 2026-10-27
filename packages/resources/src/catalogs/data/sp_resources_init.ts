import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { SpResourcesInitDefinition } from "../types/sp_resources_init.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./sp_resources_init.records0.ts";
import { records as records1 } from "./sp_resources_init.records1.ts";
import { records as records2 } from "./sp_resources_init.records2.ts";

export const catalog: CatalogTable<SpResourcesInitDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0, ...records1, ...records2],
  "sections": [{ "id": "sp_resources_init", "start": 0, "count": 1932 }],
};
