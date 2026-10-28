import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { EquipmentBagSuitFilterDefinition } from "../types/equipment_bag_suit_filter.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./equipment_bag_suit_filter.records0.ts";

export const catalog: CatalogTable<EquipmentBagSuitFilterDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [{ "id": "equipment_bag_suit_filter", "start": 0, "count": 22 }],
};
