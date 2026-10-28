import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { DailyTaskBoxDefinition } from "../types/daily_task_box.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./daily_task_box.records0.ts";

export const catalog: CatalogTable<DailyTaskBoxDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
