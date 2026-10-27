import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { WkPersonRewardDefinition } from "../types/wk_person_reward.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./wk_person_reward.records0.ts";

export const catalog: CatalogTable<WkPersonRewardDefinition> = {
  "kind": CatalogKind.Table,
  "records": [...records0],
  "sections": [],
};
