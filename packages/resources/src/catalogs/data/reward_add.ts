import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { RewardAddDefinition } from "../types/reward_add.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./reward_add.records0.ts";
export const catalog: CatalogTable<RewardAddDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
