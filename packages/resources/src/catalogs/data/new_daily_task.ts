import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { NewDailyTaskDefinition } from "../types/new_daily_task.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./new_daily_task.records0.ts";

export const catalog: CatalogTable<NewDailyTaskDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
