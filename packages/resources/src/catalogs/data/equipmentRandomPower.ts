import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { EquipmentRandomPowerDefinition } from "../types/equipmentRandomPower.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./equipmentRandomPower.records0.ts";

export const catalog: CatalogTable<EquipmentRandomPowerDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "equipmentRandomPower", "start": 0, "count": 124 }],
};
