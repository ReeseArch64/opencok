import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { WkRewardDefinition } from "../types/wk_reward.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./wk_reward.records0.ts";

export const catalog: CatalogTable<WkRewardDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
