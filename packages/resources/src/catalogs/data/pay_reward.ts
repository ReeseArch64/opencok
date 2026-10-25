import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { PayRewardDefinition } from "../types/pay_reward.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./pay_reward.records0.ts";
export const catalog: CatalogTable<PayRewardDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [{ "id": "comeback_reward", "start": 0, "count": 99 }],
};
