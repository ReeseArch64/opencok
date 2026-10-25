import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { EquipmentSmeltDefinition } from "../types/equipment_smelt.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./equipment_smelt.records0.ts";
export const catalog: CatalogTable<EquipmentSmeltDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "equipment_smelt", "start": 0, "count": 206 }],
};
