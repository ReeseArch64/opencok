import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { OnlineRewardDefinition } from "../types/onlineReward.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./onlineReward.records0.ts";

export const catalog: CatalogTable<OnlineRewardDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
