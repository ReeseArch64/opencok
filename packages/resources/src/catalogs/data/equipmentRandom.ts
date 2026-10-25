import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { EquipmentRandomDefinition } from "../types/equipmentRandom.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./equipmentRandom.records0.ts";
export const catalog: CatalogTable<EquipmentRandomDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
