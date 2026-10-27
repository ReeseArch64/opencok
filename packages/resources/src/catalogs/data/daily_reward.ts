import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { DailyRewardDefinition } from "../types/daily_reward.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./daily_reward.records0.ts";

export const catalog: CatalogTable<DailyRewardDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "daily_reward", "start": 0, "count": 8 }],
};
