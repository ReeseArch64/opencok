import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { SubcityRewardDefinition } from "../types/subcity_reward.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./subcity_reward.records0.ts";

export const catalog: CatalogTable<SubcityRewardDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
