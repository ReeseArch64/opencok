import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { DragonFoodDefinition } from "../types/dragon_food.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./dragon_food.records0.ts";
import { records as records1 } from "./dragon_food.records1.ts";
export const catalog: CatalogTable<DragonFoodDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0, ...records1],
  "sections": [],
};
