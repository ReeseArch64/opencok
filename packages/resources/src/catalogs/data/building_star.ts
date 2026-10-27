import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { BuildingStarDefinition } from "../types/building_star.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./building_star.records0.ts";
import { records as records1 } from "./building_star.records1.ts";

export const catalog: CatalogTable<BuildingStarDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0, ...records1],
  "sections": [],
};
