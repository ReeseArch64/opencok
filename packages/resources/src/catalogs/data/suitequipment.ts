import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { SuitequipmentDefinition } from "../types/suitequipment.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./suitequipment.records0.ts";

export const catalog: CatalogTable<SuitequipmentDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
