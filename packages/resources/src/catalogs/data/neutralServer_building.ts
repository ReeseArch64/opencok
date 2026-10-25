import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { NeutralServerBuildingDefinition } from "../types/neutralServer_building.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./neutralServer_building.records0.ts";
export const catalog: CatalogTable<NeutralServerBuildingDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "neutralServer_building", "start": 0, "count": 25 }],
};
