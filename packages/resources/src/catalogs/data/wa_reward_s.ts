import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { WaRewardSDefinition } from "../types/wa_reward_s.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./wa_reward_s.records0.ts";

export const catalog: CatalogTable<WaRewardSDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
