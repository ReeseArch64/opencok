import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { DragonTowerMonsterDefinition } from "../types/dragon_tower_monster.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./dragon_tower_monster.records0.ts";
import { records as records1 } from "./dragon_tower_monster.records1.ts";

export const catalog: CatalogTable<DragonTowerMonsterDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0, ...records1],
  "sections": [],
};
