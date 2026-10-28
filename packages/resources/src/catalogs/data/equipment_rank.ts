import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { EquipmentRankDefinition } from "../types/equipment_rank.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./equipment_rank.records0.ts";

export const catalog: CatalogTable<EquipmentRankDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [{ "id": "equipment_rank", "start": 0, "count": 2 }],
};
