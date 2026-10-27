import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { GeoTreasureTaskDefinition } from "../types/geo_treasure_task.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./geo_treasure_task.records0.ts";

export const catalog: CatalogTable<GeoTreasureTaskDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "geo_treasure_task", "start": 0, "count": 10 }],
};
