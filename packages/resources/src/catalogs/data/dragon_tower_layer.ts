import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { DragonTowerLayerDefinition } from "../types/dragon_tower_layer.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./dragon_tower_layer.records0.ts";
export const catalog: CatalogTable<DragonTowerLayerDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
