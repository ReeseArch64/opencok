import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { WorldLevelDefinition } from "../types/world_level.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./world_level.records0.ts";
export const catalog: CatalogTable<WorldLevelDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "world_level", "start": 0, "count": 4 }],
};
