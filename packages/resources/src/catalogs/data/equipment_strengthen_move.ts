import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { EquipmentStrengthenMoveDefinition } from "../types/equipment_strengthen_move.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./equipment_strengthen_move.records0.ts";

export const catalog: CatalogTable<EquipmentStrengthenMoveDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "equipment_strengthen_move", "start": 0, "count": 60 }],
};
