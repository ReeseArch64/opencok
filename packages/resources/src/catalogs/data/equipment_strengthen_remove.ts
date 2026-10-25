import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { EquipmentStrengthenRemoveDefinition } from "../types/equipment_strengthen_remove.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./equipment_strengthen_remove.records0.ts";
export const catalog: CatalogTable<EquipmentStrengthenRemoveDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "equipment_strengthen_remove", "start": 0, "count": 36 }],
};
