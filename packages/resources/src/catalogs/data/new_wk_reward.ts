import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { NewWkRewardDefinition } from "../types/new_wk_reward.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./new_wk_reward.records0.ts";
export const catalog: CatalogTable<NewWkRewardDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
