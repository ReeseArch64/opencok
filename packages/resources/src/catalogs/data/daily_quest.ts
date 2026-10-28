import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { DailyQuestDefinition } from "../types/daily_quest.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./daily_quest.records0.ts";

export const catalog: CatalogTable<DailyQuestDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [{ "id": "daily_quest", "start": 0, "count": 30 }],
};
