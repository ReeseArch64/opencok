import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { NeutralServerRewardDefinition } from "../types/neutralServer_reward.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./neutralServer_reward.records0.ts";
export const catalog: CatalogTable<NeutralServerRewardDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
