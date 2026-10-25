import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { DragonCrystalConditionDefinition } from "../types/dragon_crystal_condition.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./dragon_crystal_condition.records0.ts";
export const catalog: CatalogTable<DragonCrystalConditionDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
