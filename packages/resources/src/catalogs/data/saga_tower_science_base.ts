import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { SagaTowerScienceBaseDefinition } from "../types/saga_tower_science_base.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./saga_tower_science_base.records0.ts";
import { records as records1 } from "./saga_tower_science_base.records1.ts";

export const catalog: CatalogTable<SagaTowerScienceBaseDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0, ...records1],
    "sections": [],
};
