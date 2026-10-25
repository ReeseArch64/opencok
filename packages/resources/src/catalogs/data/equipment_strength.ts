import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { EquipmentStrengthDefinition } from "../types/equipment_strength.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./equipment_strength.records0.ts";
export const catalog: CatalogTable<EquipmentStrengthDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
