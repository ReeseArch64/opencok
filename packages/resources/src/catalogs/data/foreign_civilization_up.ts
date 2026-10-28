import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { ForeignCivilizationUpDefinition } from "../types/foreign_civilization_up.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./foreign_civilization_up.records0.ts";
import { records as records1 } from "./foreign_civilization_up.records1.ts";
import { records as records2 } from "./foreign_civilization_up.records2.ts";
import { records as records3 } from "./foreign_civilization_up.records3.ts";
import { records as records4 } from "./foreign_civilization_up.records4.ts";
import { records as records5 } from "./foreign_civilization_up.records5.ts";

export const catalog: CatalogTable<ForeignCivilizationUpDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0, ...records1, ...records2, ...records3, ...records4, ...records5],
    "sections": [{ "id": "foreign_civilization_up", "start": 0, "count": 3761 }],
};
