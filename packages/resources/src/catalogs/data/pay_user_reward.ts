import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { PayUserRewardDefinition } from "../types/pay_user_reward.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./pay_user_reward.records0.ts";
export const catalog: CatalogTable<PayUserRewardDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
