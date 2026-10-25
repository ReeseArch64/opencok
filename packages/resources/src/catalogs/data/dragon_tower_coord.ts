import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { DragonTowerCoordDefinition } from "../types/dragon_tower_coord.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./dragon_tower_coord.records0.ts";
export const catalog: CatalogTable<DragonTowerCoordDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "dragon_tower_coord", "start": 0, "count": 5 }],
};
