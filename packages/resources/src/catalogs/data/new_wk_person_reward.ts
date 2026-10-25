import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { NewWkPersonRewardDefinition } from "../types/new_wk_person_reward.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./new_wk_person_reward.records0.ts";
export const catalog: CatalogTable<NewWkPersonRewardDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
