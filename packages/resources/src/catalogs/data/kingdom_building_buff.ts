import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { KingdomBuildingBuffDefinition } from "../types/kingdom_building_buff.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./kingdom_building_buff.records0.ts";

export const catalog: CatalogTable<KingdomBuildingBuffDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "kingdom_building_buff", "start": 0, "count": 7 }],
};
