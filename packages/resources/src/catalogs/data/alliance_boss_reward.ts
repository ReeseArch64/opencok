import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { AllianceBossRewardDefinition } from "../types/alliance_boss_reward.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./alliance_boss_reward.records0.ts";
export const catalog: CatalogTable<AllianceBossRewardDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
