import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { WbRewardDefinition } from "../types/wb_reward.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./wb_reward.records0.ts";
export const catalog: CatalogTable<WbRewardDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [
    { "id": "user", "start": 0, "count": 18 },
    { "id": "user1", "start": 18, "count": 18 },
    { "id": "user2", "start": 36, "count": 18 },
    { "id": "kingdom", "start": 54, "count": 10 },
  ],
};
