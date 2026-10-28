import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { DailyTaskRewardDefinition } from "../types/daily_task_reward.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./daily_task_reward.records0.ts";

export const catalog: CatalogTable<DailyTaskRewardDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
