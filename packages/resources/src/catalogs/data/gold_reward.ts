import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { GoldRewardDefinition } from "../types/gold_reward.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./gold_reward.records0.ts";

export const catalog: CatalogTable<GoldRewardDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "gold_reward", "start": 0, "count": 14 }],
};
