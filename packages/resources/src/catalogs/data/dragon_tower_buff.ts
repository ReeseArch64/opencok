import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { DragonTowerBuffDefinition } from "../types/dragon_tower_buff.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./dragon_tower_buff.records0.ts";
export const catalog: CatalogTable<DragonTowerBuffDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
