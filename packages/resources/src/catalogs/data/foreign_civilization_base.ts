import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { ForeignCivilizationBaseDefinition } from "../types/foreign_civilization_base.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./foreign_civilization_base.records0.ts";

export const catalog: CatalogTable<ForeignCivilizationBaseDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [{ "id": "foreign_civilization_base", "start": 0, "count": 230 }],
};
