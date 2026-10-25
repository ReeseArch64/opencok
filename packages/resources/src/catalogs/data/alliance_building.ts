import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { AllianceBuildingDefinition } from "../types/alliance_building.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./alliance_building.records0.ts";
export const catalog: CatalogTable<AllianceBuildingDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "alliance_building", "start": 0, "count": 47 }],
};
