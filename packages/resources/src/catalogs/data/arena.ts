import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { ArenaDefinition } from "../types/arena.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./arena.records0.ts";
export const catalog: CatalogTable<ArenaDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "arena", "start": 0, "count": 60 }],
};
