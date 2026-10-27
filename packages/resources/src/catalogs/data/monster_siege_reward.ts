import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { MonsterSiegeRewardDefinition } from "../types/monster_siege_reward.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./monster_siege_reward.records0.ts";

export const catalog: CatalogTable<MonsterSiegeRewardDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [
    { "id": "goal_reward", "start": 0, "count": 25 },
    { "id": "alliance_rank", "start": 25, "count": 10 },
    { "id": "member_rank", "start": 35, "count": 10 },
  ],
};
