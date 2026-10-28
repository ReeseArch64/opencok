import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { EquipmentDefinition } from "../types/equipment.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./equipment.records0.ts";
import { records as records1 } from "./equipment.records1.ts";
import { records as records2 } from "./equipment.records2.ts";
import { records as records3 } from "./equipment.records3.ts";

export const catalog: CatalogTable<EquipmentDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0, ...records1, ...records2, ...records3],
    "sections": [],
};
